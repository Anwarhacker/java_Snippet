import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// POST: Upload a file (binary or image) to a target directory
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const parentPath = formData.get('parentPath');

    if (!file || !parentPath) {
      return NextResponse.json({ error: 'Missing parameters (file, parentPath)' }, { status: 400 });
    }

    const resolvedParent = path.resolve(parentPath);

    // Verify parent directory exists and is a directory
    try {
      const stats = await fs.stat(resolvedParent);
      if (!stats.isDirectory()) {
        return NextResponse.json({ error: 'Target destination is not a directory' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Target directory does not exist' }, { status: 400 });
    }

    const targetPath = path.join(resolvedParent, file.name);

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to local filesystem
    await fs.writeFile(targetPath, buffer);

    return NextResponse.json({
      success: true,
      name: file.name,
      path: targetPath
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
