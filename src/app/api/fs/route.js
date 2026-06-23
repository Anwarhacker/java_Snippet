import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// GET: List files and folders inside a given directory
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetPath = searchParams.get('path');

    if (!targetPath) {
      // Default to the specified user directory, but fallback to project root if it doesn't exist
      const hardcodedPath = "C:\\Users\\anwar\\OneDrive\\Desktop\\Kodnest-Java";
      try {
        await fs.access(hardcodedPath);
        targetPath = hardcodedPath;
      } catch {
        // Fallback to project directory or user home
        targetPath = process.cwd(); 
      }
    }

    // Resolve to absolute path
    targetPath = path.resolve(targetPath);

    const stats = await fs.stat(targetPath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: 'Path is not a directory' }, { status: 400 });
    }

    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    
    const items = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(targetPath, entry.name);
        try {
          const itemStats = await fs.stat(fullPath);
          return {
            name: entry.name,
            path: fullPath,
            isDir: entry.isDirectory(),
            size: entry.isFile() ? itemStats.size : 0,
            mtime: itemStats.mtime.toISOString(),
            birthtimeMs: itemStats.birthtimeMs || itemStats.ctimeMs || itemStats.mtimeMs || Date.now(),
          };
        } catch (err) {
          // If a file cannot be read (e.g. permission or broken symlink), return basic info
          return {
            name: entry.name,
            path: fullPath,
            isDir: entry.isDirectory(),
            size: 0,
            mtime: new Date().toISOString(),
            birthtimeMs: Date.now(),
            error: err.message,
          };
        }
      })
    );

    // Group items for custom layout: Directories, MD Files, and Other Files
    const directories = items.filter(item => item.isDir);
    const mdFiles = items.filter(item => !item.isDir && item.name.toLowerCase().endsWith('.md'));
    const otherFiles = items.filter(item => !item.isDir && !item.name.toLowerCase().endsWith('.md'));

    // Sort directories alphabetically
    directories.sort((a, b) => a.name.localeCompare(b.name));

    // Sort MD files by birthtimeMs ASCENDING to determine creation index order (1st, 2nd...)
    mdFiles.sort((a, b) => a.birthtimeMs - b.birthtimeMs);
    mdFiles.forEach((item, idx) => {
      item.mdIndex = idx + 1; // First created gets 1, second gets 2, etc.
    });

    // Sort MD files by birthtimeMs DESCENDING so recently created MD files are always at the top
    mdFiles.sort((a, b) => b.birthtimeMs - a.birthtimeMs);

    // Sort other files alphabetically
    otherFiles.sort((a, b) => a.name.localeCompare(b.name));

    // Combine sections: directories first, then recently created MD files, then other files
    const sortedItems = [...directories, ...mdFiles, ...otherFiles];

    return NextResponse.json({
      currentPath: targetPath,
      parentPath: path.dirname(targetPath) === targetPath ? null : path.dirname(targetPath),
      items: sortedItems,
    });
  } catch (error) {
    console.error('Error listing directory:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new file or folder
export async function POST(request) {
  try {
    const { type, parentPath, name } = await request.json();

    if (!parentPath || !name || !type) {
      return NextResponse.json({ error: 'Missing parameters (type, parentPath, name)' }, { status: 400 });
    }

    const targetPath = path.resolve(path.join(parentPath, name));

    // Check if target already exists
    try {
      await fs.access(targetPath);
      return NextResponse.json({ error: `${type === 'file' ? 'File' : 'Folder'} already exists` }, { status: 400 });
    } catch {
      // Path does not exist, which is what we want
    }

    if (type === 'folder') {
      await fs.mkdir(targetPath, { recursive: true });
    } else if (type === 'file') {
      // Write an empty string to initialize the file
      await fs.writeFile(targetPath, '', 'utf8');
    } else {
      return NextResponse.json({ error: 'Invalid type. Must be file or folder' }, { status: 400 });
    }

    return NextResponse.json({ success: true, path: targetPath });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Rename or move a file/folder
export async function PUT(request) {
  try {
    const { sourcePath, destinationPath } = await request.json();

    if (!sourcePath || !destinationPath) {
      return NextResponse.json({ error: 'Missing parameters (sourcePath, destinationPath)' }, { status: 400 });
    }

    const resolvedSrc = path.resolve(sourcePath);
    const resolvedDest = path.resolve(destinationPath);

    // Verify source exists
    await fs.access(resolvedSrc);

    // Verify parent of destination exists
    const destParent = path.dirname(resolvedDest);
    await fs.access(destParent);

    // Perform rename
    await fs.rename(resolvedSrc, resolvedDest);

    return NextResponse.json({ success: true, sourcePath: resolvedSrc, destinationPath: resolvedDest });
  } catch (error) {
    console.error('Error renaming/moving resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a file or folder
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get('path');

    if (!targetPath) {
      return NextResponse.json({ error: 'Missing parameter: path' }, { status: 400 });
    }

    const resolvedPath = path.resolve(targetPath);

    const stats = await fs.stat(resolvedPath);
    if (stats.isDirectory()) {
      // Remove directory and its contents recursively
      await fs.rm(resolvedPath, { recursive: true, force: true });
    } else {
      // Remove file
      await fs.unlink(resolvedPath);
    }

    return NextResponse.json({ success: true, deletedPath: resolvedPath });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
