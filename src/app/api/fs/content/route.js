import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// GET: Read text content of a file
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get('path');

    if (!targetPath) {
      return NextResponse.json({ error: 'Missing parameter: path' }, { status: 400 });
    }

    const resolvedPath = path.resolve(targetPath);

    // Verify it exists and is a file
    const stats = await fs.stat(resolvedPath);
    if (!stats.isFile()) {
      return NextResponse.json({ error: 'Path is not a file' }, { status: 400 });
    }

    // Read the file as UTF-8
    const content = await fs.readFile(resolvedPath, 'utf8');

    // A simple check to see if the file is binary
    // Look for null byte in the first 8000 characters
    const isBinary = content.slice(0, 8000).includes('\u0000');
    if (isBinary) {
      return NextResponse.json({ 
        error: 'Binary files cannot be edited in this text editor', 
        isBinary: true 
      }, { status: 400 });
    }

    return NextResponse.json({ content, path: resolvedPath });
  } catch (error) {
    console.error('Error reading file content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Write/update content of a file
export async function POST(request) {
  try {
    const { path: targetPath, content } = await request.json();

    if (!targetPath || content === undefined) {
      return NextResponse.json({ error: 'Missing parameters (path, content)' }, { status: 400 });
    }

    const resolvedPath = path.resolve(targetPath);

    // Verify it exists and is a file
    const stats = await fs.stat(resolvedPath);
    if (!stats.isFile()) {
      return NextResponse.json({ error: 'Path is not a file' }, { status: 400 });
    }

    // Write content
    await fs.writeFile(resolvedPath, content, 'utf8');

    return NextResponse.json({ success: true, path: resolvedPath });
  } catch (error) {
    console.error('Error writing file content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
