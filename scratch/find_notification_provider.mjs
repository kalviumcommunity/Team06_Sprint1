import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('NotificationProvider') || content.includes('notification')) {
        results.push({ path: fullPath, hasProvider: content.includes('NotificationProvider') });
      }
    }
  }
  return results;
}

const found = walk('.');
console.log(JSON.stringify(found, null, 2));
