#!/usr/bin/env node
import { validateFileJsonYaml, validateTemplateIsHtml } from './validators.js';
import { FileExtensionValidationError } from './errors.js';
import inquirer from 'inquirer';
import * as fs from 'node:fs/promises';
import * as yaml from 'js-yaml';
import { basename } from 'path';

const questions = [
  {
    type: 'input',
    name: 'htmlTemplatePath',
    message: 'Path to the html template: ',
    validate: (input) => {
      return new Promise((resolve, reject) => {
        const [valid, ext] = validateTemplateIsHtml(input);
        if (!valid) {
          reject(
            new FileExtensionValidationError(
              `${ext || 'The path ending'} extensioon does not match .html`,
            ),
          );
        }
        resolve(valid);
      });
    },
  },
  {
    type: 'input',
    name: 'fileNamePath',
    message: 'Path to the data file: ',
    validate: (input) => {
      return new Promise((resolve, reject) => {
        const [valid, ext] = validateFileJsonYaml(input);
        if (!valid) {
          reject(
            new FileExtensionValidationError(
              `${
                ext || 'The path ending'
              } extensioon does not match .json nor .yaml`,
            ),
          );
        }
        resolve(valid);
      });
    },
  },
];

const literalsRegex = /(?<=\$\().*?(?=\))/;
const templateRegex = /\$\(([^)]+)\)/g;

async function readFileAtPath(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    return data;
  } catch (e) {
    console.log('sosi huy debil blyamb');
  }
}

function isJson(ext) {
  return ext === 'json';
}

function isYaml(ext) {
  return ext === 'yaml';
}

function getKey(str) {
  return str.match(literalsRegex)[0];
}

inquirer
  .prompt(questions)
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
          const key = getKey(v);
          html = html.replace(v, file[key] || 'Error');
        });

        console.log(html);
        // console.log(html);
      });
    });
  })
  .catch((err) => console.log(err.message));
