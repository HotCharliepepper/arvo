import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Dependency-free build. Works with Node 18+ on Windows, macOS and Linux.
const dir = dirname(fileURLToPath(import.meta.url));
let html = readFileSync(join(dir, 'index.html'), 'utf8');
const css = readFileSync(join(dir, 'styles.css'), 'utf8');
const js = readFileSync(join(dir, 'app.js'), 'utf8');
const cssMarker = '<link rel="stylesheet" href="styles.css"/>';
const jsMarker = '<script src="app.js"></script>';
if (!html.includes(cssMarker) || !html.includes(jsMarker)) {
  throw new Error('index.html의 CSS/JS 연결 경로가 변경되었습니다. 빌드를 중단합니다.');
}
html = html.replace(cssMarker, `<style>${css}</style>`);
html = html.replace(jsMarker, `<script>${js}</script>`);
let assets = 0;
html = html.replace(/assets\/[A-Za-z0-9_-]+\.(?:webp|png|jpg)/g, (relative) => {
  const path = join(dir, relative);
  const ext = extname(path).toLowerCase();
  const mime = ext === '.jpg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'image/webp';
  const data = readFileSync(path).toString('base64');
  assets += 1;
  return `data:${mime};base64,${data}`;
});
const out = join(dir, 'dist');
mkdirSync(out, {recursive:true});
writeFileSync(join(out, 'index.html'), html, 'utf8');
console.log(`완료: dist/index.html (단일 파일, 이미지 참조 ${assets}개 포함)`);
