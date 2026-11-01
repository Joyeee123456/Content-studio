import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import publicFiles from './public-files.js';

test('serves the website while keeping project internals private', async t => {
  const app = express();
  app.use(publicFiles);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const route of ['/', '/index.html', '/robots.txt', '/sitemap.xml']) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    await response.text();
  }
  for (const route of ['/.env', '/.env.example', '/server.js', '/package.json', '/.git/config', '/public-files.js']) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 404, route);
    await response.text();
  }
});
