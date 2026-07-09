import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request) {
  try {
    const { code, input } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // 1. Remove package declaration so it compiles in the default package
    // This removes 'package problems;', 'package logic;', etc.
    const cleanCode = code.replace(/^\s*package\s+[\w.]+;\s*/m, '');

    // 2. Extract class name from code
    let className = 'Main';
    const match = cleanCode.match(/(?:public\s+)?class\s+(\w+)/);
    if (match && match[1]) {
      className = match[1];
    }

    // 3. Create a unique temporary directory
    const randomSub = Math.random().toString(36).substring(2, 9);
    const tempDir = path.join(os.tmpdir(), `java-runner-${Date.now()}-${randomSub}`);
    await fs.mkdir(tempDir, { recursive: true });

    // 4. Write code to <ClassName>.java
    const filePath = path.join(tempDir, `${className}.java`);
    await fs.writeFile(filePath, cleanCode, 'utf8');

    // 5. Compile the java file
    let compileError = '';
    try {
      await execPromise(`javac ${className}.java`, { cwd: tempDir, timeout: 8000 });
    } catch (err) {
      compileError = err.stderr || err.stdout || err.message;
    }

    if (compileError) {
      await cleanupDir(tempDir);
      return NextResponse.json({
        success: false,
        phase: 'compilation',
        error: compileError
      });
    }

    // 6. Run the java class with input on stdin
    let runError = '';
    let runOutput = '';
    
    try {
      const runPromise = new Promise((resolve) => {
        const process = exec(`java ${className}`, { cwd: tempDir, timeout: 8000 }, (error, stdout, stderr) => {
          resolve({
            stdout: stdout || '',
            stderr: stderr || '',
            error: error
          });
        });

        if (input && process.stdin) {
          process.stdin.write(input);
          process.stdin.end();
        }
      });

      const result = await runPromise;
      runOutput = result.stdout;
      runError = result.stderr;
      if (result.error && !runError) {
        // If the process timed out or had non-zero exit code
        if (result.error.signal === 'SIGTERM') {
          runError = 'Execution timed out (limit: 8s)';
        } else {
          runError = result.error.message;
        }
      }
    } catch (err) {
      runError = err.message;
    }

    // Clean up temporary files
    await cleanupDir(tempDir);

    return NextResponse.json({
      success: !runError,
      phase: runError ? 'runtime' : 'success',
      output: runOutput,
      error: runError || null
    });

  } catch (error) {
    console.error('Execution API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function cleanupDir(directory) {
  try {
    await fs.rm(directory, { recursive: true, force: true });
  } catch (err) {
    console.error('Error cleaning up temp directory:', err);
  }
}
