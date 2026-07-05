const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function main() {
  const appRoot = path.resolve(__dirname, '..');
  const projectRoot = path.resolve(appRoot, '..');
  const htmlPath = path.join(projectRoot, 'md-studio.html');
  const markdownPath = path.join(appRoot, 'examples', 'apollo-11.md');
  const screenshotDir = path.join(appRoot, 'screenshots');
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const url = `file:///${htmlPath.replace(/\\/g, '/').replace(/ /g, '%20')}`;

  fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 980 },
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: '.footer-credit{display:none!important}' });
  await page.waitForFunction(
    () => typeof renderMarkdown === 'function' && typeof setView === 'function',
    null,
    { timeout: 30000 },
  );

  await page.evaluate(async (text) => {
    await renderMarkdown(text, 'apollo-11.md');
  }, markdown);
  await page.waitForSelector('#contentWrapper', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(screenshotDir, 'preview.png'),
    fullPage: false,
  });

  await page.evaluate(() => setView('source'));
  await page.waitForSelector('#editorWrapper', { state: 'visible', timeout: 30000 });
  await page.evaluate(() => {
    const editor = document.querySelector('#editor');
    if (editor) editor.scrollTop = 0;
  });
  await page.waitForTimeout(700);
  await page.screenshot({
    path: path.join(screenshotDir, 'editor.png'),
    fullPage: false,
  });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
