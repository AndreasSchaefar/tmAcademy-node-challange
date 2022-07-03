import { InvalidPathError } from './errors.js';
import { literalsRegex } from './regex.js';
import * as http from 'http';
import * as fs from 'node:fs/promises';

async function readFileAtPath(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    return data;
  } catch (e) {
    throw new InvalidPathError(e.message);
  }
}

function serveHtml(html) {
  const server = http.createServer((_, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(html);
  });
  let port = 3000;
  server.listen(port, () => {
    console.log(`Serving html on port: ${port}.\nUse Control + C to abort.`);
  });
}

function getVariableKey(str) {
  return str.match(literalsRegex)[0];
}

export { readFileAtPath, serveHtml, getVariableKey };
