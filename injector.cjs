const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, './');
const outputDir = path.resolve(__dirname, 'temp');
const MAX_DEPTH = 10; // Puedes ajustar este límite

fs.mkdirSync(outputDir, { recursive: true });

const injectRegex = /<!--\s*inject:([^\s]+)\s*-->/g;

function injectContent(filePath, depth = 0, visited = new Set()) {
    if (depth > MAX_DEPTH) {
        return `<!-- Max injection depth (${MAX_DEPTH}) reached at ${filePath} -->`;
    }
    if (visited.has(filePath)) {
        return `<!-- Circular injection detected at ${filePath} -->`;
    }
    visited.add(filePath);

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        return `<!-- Could not read "${filePath}": ${e.message} -->`;
    }

    return content.replace(injectRegex, (match, injectPath) => {
        const resolvedPath = path.isAbsolute(injectPath)
            ? injectPath
            : path.resolve(path.dirname(filePath), injectPath);
        try {
            return injectContent(resolvedPath, depth + 1, new Set(visited));
        } catch (e) {
            return `<!-- Could not inject "${injectPath}" into "${filePath}": ${e.message} -->`;
        }
    });
}

fs.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(sourceDir, file);
        const result = injectContent(filePath);
        fs.writeFileSync(path.join(outputDir, file), result);
    }
});