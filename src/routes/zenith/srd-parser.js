import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const SOURCE_DIR = path.resolve(process.cwd(), 'docs/srd'); 
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/lib/data/srd-metadata.json');

async function getMarkdownFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    
    for (const dirent of list) {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            results = results.concat(await getMarkdownFiles(res));
        } else if (dirent.isFile() && /\.md$/.test(dirent.name)) {
            results.push(res);
        }
    }
    return results;
}

async function generateMetadata() {
    console.log('Starting SRD metadata generation...');

    try {
        await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

        const files = await getMarkdownFiles(SOURCE_DIR);
        console.log(`Found ${files.length} SRD files.`);

        const metadataList = [];

        for (const filePath of files) {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const stats = await fs.stat(filePath);
            
            const { data } = matter(fileContent);

            const entry = {
                id: data.id || path.basename(filePath, '.md').toLowerCase().replace(/ /g, '-'),
                title: data.title || path.basename(filePath, '.md'),
                description: data.description || "No description provided.",
                version: data.version || "0.0.0",
                lastModified: stats.mtime.toISOString().split('T')[0],
                icon: data.icon || data.title?.charAt(0).toUpperCase() || '?'
            };

            metadataList.push(entry);
            console.log(`Processed: ${entry.title}`);
        }

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(metadataList, null, 4));
        console.log(`Success! Metadata written to: ${OUTPUT_FILE}\n`);

    } catch (error) {
        console.error('Error generating metadata:', error.message);
        process.exit(1);
    }
}

generateMetadata();
