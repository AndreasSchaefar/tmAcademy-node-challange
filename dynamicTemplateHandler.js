#!/usr/bin/env node
import inquirer from 'inquirer';
import * as yaml from 'js-yaml';
import { basename } from 'path';
import { isYaml, isJson } from './utils/validators.js';
import { templateRegex } from './utils/regex.js';
import { readFileAtPath, serveHtml, getVariableKey } from './utils/utils.js';
import { QUESTIONS } from './questions.js';

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
