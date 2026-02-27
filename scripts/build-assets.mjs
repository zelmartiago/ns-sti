import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function ensureDist() {
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }
}

function buildIndexHtml() {
    const indexPath = path.join(rootDir, 'index.html');
    const raw = fs.readFileSync(indexPath, 'utf8');

    const replaced = raw.replace(
        /<script\s+type="module"\s+src="app\.js"><\/script>/,
        '<script src="app.bundle.js"></script>'
    );

    const outPath = path.join(distDir, 'index.html');
    fs.writeFileSync(outPath, replaced, 'utf8');
}

function copyStyles() {
    const src = path.join(rootDir, 'styles.css');
    const dest = path.join(distDir, 'styles.css');
    fs.copyFileSync(src, dest);
}

ensureDist();
buildIndexHtml();
copyStyles();

console.log('✅ Archivos estáticos copiados a dist/ (index.html + styles.css).');

