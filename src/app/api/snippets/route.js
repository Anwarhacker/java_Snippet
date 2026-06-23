import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SNIPPETS_FILE = path.join(process.cwd(), 'src', 'data', 'snippets.json');

// GET: Read all snippets from the local file
export async function GET() {
  try {
    // Ensure the data directory exists
    await fs.mkdir(path.dirname(SNIPPETS_FILE), { recursive: true });

    try {
      await fs.access(SNIPPETS_FILE);
    } catch {
      // If file doesn't exist, create it with an empty array
      await fs.writeFile(SNIPPETS_FILE, JSON.stringify([]), 'utf8');
      return NextResponse.json([]);
    }

    const content = await fs.readFile(SNIPPETS_FILE, 'utf8');
    const snippets = JSON.parse(content);
    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error reading snippets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save all snippets to the local file
export async function POST(request) {
  try {
    const snippets = await request.json();
    
    if (!Array.isArray(snippets)) {
      return NextResponse.json({ error: 'Data must be an array of snippets' }, { status: 400 });
    }

    // Ensure the data directory exists
    await fs.mkdir(path.dirname(SNIPPETS_FILE), { recursive: true });

    await fs.writeFile(SNIPPETS_FILE, JSON.stringify(snippets, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving snippets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// PUT: Export a single snippet to a physical file in a workspace (with category subfolder)
export async function PUT(request) {
  try {
    const { name, code, targetPath, category } = await request.json();

    if (!name || !code || !targetPath) {
      return NextResponse.json({ error: 'Missing parameters (name, code, targetPath)' }, { status: 400 });
    }

    // Determine final directory: targetPath/category (if category provided)
    let finalDir = targetPath;
    if (category && category.trim()) {
      finalDir = path.join(targetPath, category.trim());
    }

    // Ensure the final directory exists
    await fs.mkdir(finalDir, { recursive: true });

    const filePath = path.join(finalDir, name.endsWith('.java') ? name : `${name}.java`);

    await fs.writeFile(filePath, code, 'utf8');

    return NextResponse.json({ success: true, filePath });
  } catch (error) {
    console.error('Error exporting snippet:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
