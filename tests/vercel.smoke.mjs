import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
const built = await readFile(new URL(`../${config.outputDirectory}/index.html`, import.meta.url), 'utf8');
assert.match(built, /<div id="root"><\/div>/);
assert.match(built, /开口日记/);
// A slow third-party font must never block the HTML shell or app startup.
assert.doesNotMatch(built, /<link[^>]+href=["']https?:[^>]+>/i);
const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
assert.doesNotMatch(layout, /<link[^>]+rel=["']stylesheet/);
assert.doesNotMatch(built, /src="\/main\.tsx"/);
assert.match(built, /<script type="module" data-sayit-app>/);
assert.match(built, /<style data-sayit-styles>/);
assert.doesNotMatch(built, /<(?:script|link)[^>]+(?:src|href)="\/assets\//);
assert.match(built, /rel="preload"[^>]+huiwen-ui-v1\.woff2/);
const typography = await readFile(new URL('../app/scrapbook.css', import.meta.url), 'utf8');
assert.match(typography, /font-display:optional/);
assert.doesNotMatch(built, /<script[^>]+src="\/posthog-options\.js"/);
assert.ok(built.indexOf('window.sayitPosthogOptions =') < built.indexOf('posthog.init('));
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--config', 'vite.vercel.config.ts', '--host', '127.0.0.1', '--port', '4187', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview did not start')), 15000);
    server.once('error', e => { clearTimeout(timeout); reject(e); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited: ${code}`)); });
    server.stdout.on('data', data => {
      if (data.toString().includes('http://127.0.0.1:4187/')) { clearTimeout(timeout); resolve(); }
    });
  });
  const base = 'http://127.0.0.1:4187';
  for (const path of ['/', '/#diary', '/#quotes', '/#prep', '/#me']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.equal(await response.text(), built, path);
  }
  const assets = [...built.matchAll(/(?:src|href)="(\/assets\/[^"<>]+)"/g)].map(m => m[1]);
  assert.equal(assets.length, 0);
  for (const path of [...assets, '/favicon.svg', '/fonts/huiwen-ui-v1.woff2']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.arrayBuffer()).byteLength > 0, path);
    assert.ok(!response.headers.get('content-type')?.includes('text/html'), path);
  }
  console.log('Vercel static smoke passed: / and all four hash entry points return 200; inlined app/styles and font/favicon checks pass.');
} finally {
  server.kill('SIGTERM');
}
