const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(appRoot, '..');
const htmlPath = path.join(projectRoot, 'md-studio.html');

function readText(...parts) {
  return fs.readFileSync(path.join(appRoot, 'node_modules', ...parts), 'utf8');
}

function readBinary(...parts) {
  return fs.readFileSync(path.join(appRoot, 'node_modules', ...parts));
}

function fontMime(filename) {
  if (filename.endsWith('.woff2')) return 'font/woff2';
  if (filename.endsWith('.woff')) return 'font/woff';
  if (filename.endsWith('.ttf')) return 'font/ttf';
  return 'application/octet-stream';
}

function inlineKatexFonts(css) {
  return css.replace(/url\(fonts\/([^)]+)\)/g, (_match, filename) => {
    const font = readBinary('katex', 'dist', 'fonts', filename);
    return `url(data:${fontMime(filename)};base64,${font.toString('base64')})`;
  });
}

function makeStyleBlock(label, css) {
  return `<style data-embedded-dependency="${label}">\n${css}\n</style>`;
}

function makeScriptBlock(label, js) {
  return `<script data-embedded-dependency="${label}">\n${js}\n</script>`;
}

const highlightCss = readText('@highlightjs', 'cdn-assets', 'styles', 'atom-one-dark.min.css');
const katexCss = inlineKatexFonts(readText('katex', 'dist', 'katex.min.css'));

const dependencyStyles = [
  makeStyleBlock('highlight.js atom-one-dark 11.9.0', highlightCss),
  makeStyleBlock('KaTeX 0.16.47', katexCss),
].join('\n  ');

const dependencyScripts = [
  makeScriptBlock('marked 12.0.2', readText('marked', 'marked.min.js')),
  makeScriptBlock('highlight.js 11.9.0', readText('@highlightjs', 'cdn-assets', 'highlight.min.js')),
  makeScriptBlock('Mermaid 10.9.6', readText('mermaid', 'dist', 'mermaid.min.js')),
  makeScriptBlock('KaTeX 0.16.47', readText('katex', 'dist', 'katex.min.js')),
  makeScriptBlock('KaTeX auto-render 0.16.47', readText('katex', 'dist', 'contrib', 'auto-render.min.js')),
  makeScriptBlock('Turndown 7.2.0', readText('turndown', 'dist', 'turndown.js')),
  makeScriptBlock('turndown-plugin-gfm 1.0.2', readText('turndown-plugin-gfm', 'dist', 'turndown-plugin-gfm.js')),
].join('\n  ');

let html = fs.readFileSync(htmlPath, 'utf8');

function replaceBetweenMarkers(source, startMarkers, endMarkers, replacement) {
  const starts = startMarkers
    .map((marker) => source.indexOf(marker))
    .filter((index) => index >= 0);
  if (!starts.length) throw new Error('Could not find start marker');

  const start = Math.min(...starts);
  const endCandidates = endMarkers
    .map((marker) => source.indexOf(marker, start))
    .filter((index) => index >= 0);
  if (!endCandidates.length) throw new Error('Could not find end marker');
  const end = Math.min(...endCandidates);

  return source.slice(0, start) + replacement + source.slice(end);
}

html = replaceBetweenMarkers(
  html,
  ['  <!-- Fontes:', '  <!-- Runtime styles embedded for offline use. -->'],
  ['  <style>'],
  `  <!-- Runtime styles embedded for offline use. -->\n  ${dependencyStyles}\n\n`,
);

html = replaceBetweenMarkers(
  html,
  ['  <!-- ═══════════ Dependencies ═══════════ -->', '  <!-- ═══════════ Embedded Dependencies ═══════════ -->'],
  [
    '  <script>\n    /* ══════════════════════════════════════════\n       State',
    '  <script>\r\n    /* ══════════════════════════════════════════\r\n       State',
  ],
  `  <!-- ═══════════ Embedded Dependencies ═══════════ -->\n  ${dependencyScripts}\n\n`,
);

const validationHtml = html
  .replace(/<script data-embedded-dependency="[^"]+">[\s\S]*?<\/script>/g, '')
  .replace(/<style data-embedded-dependency="[^"]+">[\s\S]*?<\/style>/g, '');

if (/<script\s+src=|<link\s+[^>]*href=["']https?:\/\//i.test(validationHtml)) {
  throw new Error('HTML still contains external script or stylesheet URLs after embedding dependencies.');
}

fs.writeFileSync(htmlPath, html);
console.log('Embedded runtime dependencies into md-studio.html');
