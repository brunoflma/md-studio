const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('docs/index.html');
const css = read('docs/assets/site.css');
const app = read('md-studio.html');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  if (value.startsWith('#')) {
    if (value !== '#') assert(ids.includes(value.slice(1)), `Missing anchor: ${value}`);
  } else if (!/^https?:\/\//.test(value)) {
    assert(fs.existsSync(path.join(root, 'docs', value.split(/[?#]/)[0])), `Missing file: ${value}`);
  }
}
for (const [, target] of html.matchAll(/(?:aria-controls|data-copy)="([^"]+)"/g)) {
  assert(ids.includes(target), `Missing control target: ${target}`);
}
for (const [, value] of css.matchAll(/url\(['"]?([^)'"\s]+)/g)) {
  assert(fs.existsSync(path.join(root, 'docs/assets', value)), `Missing CSS resource: ${value}`);
}
for (const token of ['#0A1224', '#C8A862', '#F4F1E9', 'Georgia', 'Consolas']) {
  assert(css.includes(token) && app.includes(token), `Brand token differs from application: ${token}`);
}
const example = html.match(/<pre id="sample-markdown">([\s\S]*?)<\/pre>/)[1]
  .replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\r\n/g, '\n').trim();
assert.equal(example, read('docs/examples/notas-de-pesquisa.md').replace(/\r\n/g, '\n').trim(), 'Copied example must match download');
for (const [destination, original] of [['preview.png', 'preview.png'], ['source.png', 'editor.png']]) {
  assert.deepEqual(fs.readFileSync(path.join(root, 'docs/assets', destination)), fs.readFileSync(path.join(root, '.app/screenshots', original)), 'Captures must match the application screenshots');
}
const social = fs.readFileSync(path.join(root, 'docs/assets/social-preview.png'));
assert.deepEqual([...social.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
assert.deepEqual([social.readUInt32BE(16), social.readUInt32BE(20)], [1280, 640]);
assert(html.includes('https://brunoflma.github.io/md-studio/assets/social-preview.png'));
for (const [tag] of html.matchAll(/<a\b[^>]*data-github[^>]*>/g)) {
  assert.match(tag.match(/href="([^"]+)"/)[1], /^https:\/\/github\.com\/brunoflma\/md-studio(?:[\/#]|$)/);
}
assert(!/<script[^>]+src="https?:/.test(html), 'The landing page must not depend on remote scripts');
assert(!/fetch\(|XMLHttpRequest|localStorage|document\.cookie/.test(read('docs/assets/site.js')), 'Presentation interactions should stay local');
console.log('Verified: links, controls, MD Studio identity, example parity, real captures, social preview and GitHub destinations.');
