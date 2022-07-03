#!/usr/bin/env node
import inquirer from 'inquirer';
import * as yaml from 'js-yaml';
import { basename } from 'path';
import { isYaml, isJson } from './validators.js';
import { QUESTIONS } from './questions.js';
import { templateRegex } from './regex.js';
import { readFileAtPath, serveHtml, getVariableKey } from './utils.js';

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
