import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const publicFiles = express.Router();

// Keep server code, credentials and Git metadata outside the public routes.
for (const [route, file] of [
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/robots.txt', 'robots.txt'],
  ['/sitemap.xml', 'sitemap.xml']
]) {
  publicFiles.get(route, (_req, res) => res.sendFile(path.join(directory, file)));
}

export default publicFiles;
