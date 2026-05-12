import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dirsToFix = ['app', 'lib', 'domain', 'scripts', 'shared', 'components', 'hooks'];

function walk(dir: string, callback: (file: string) => void) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
};

const replacements = [
    { from: /@\/backend\/lib\//g, to: '@/services/' },
    { from: /@\/backend\/shared\//g, to: '@/shared/' },
    { from: /@\/backend\//g, to: '@/' },
    { from: /@\/frontend\//g, to: '@/' },
];

dirsToFix.forEach(dir => {
    const fullDir = path.join(rootDir, dir);
    if (!fs.existsSync(fullDir)) return;
    
    walk(fullDir, (filePath) => {
        if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.mts')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        replacements.forEach(r => {
            newContent = newContent.replace(r.from, r.to);
        });
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed imports in: ${filePath}`);
        }
    });
});

