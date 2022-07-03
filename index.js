#!/usr/bin/env node
import inquirer from 'inquirer';
import * as fs from 'node:fs/promises';
import * as yaml from 'js-yaml';
import { basename } from 'path';
import { isYaml, isJson } from './validators.js';
import { InvalidPathError } from './errors.js';
import { QUESTIONS } from './questions.js';
import { templateRegex, literalsRegex } from './regex.js';
import * as http from 'http';

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
  server.listen('3000');
  console.log('Serving html on port: 3000.\nUse Control + C to abort.');
}

function getVariableKey(str) {
  return str.match(literalsRegex)[0];
}

inquirer
  .prompt(QUESTIONS)
  .then((answers) => {
    const { htmlTemplatePath, fileNamePath } = answers;
    const [_, fileExt] = basename(fileNamePath).split('.');

    readFileAtPath(htmlTemplatePath).then((html) => {
      const variables = html.match(templateRegex);
      readFileAtPath(fileNamePath).then((file) => {
        if (isJson(fileExt)) {
          file = JSON.parse(file);
        } else if (isYaml(fileExt)) {
          file = yaml.load(file);
        }
        variables.forEach((v) => {
          const key = getVariableKey(v);
          html = html.replace(v, file[key]);
        });

        serveHtml(html);
      });
    });
  })
  .catch((err) => console.log(err.message));
