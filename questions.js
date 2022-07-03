import { FileExtensionValidationError } from './errors.js';
import {
  validateFileJsonYaml,
  validateTemplateIsHtml,
} from './validators.js';

export const QUESTIONS = [
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
              `${
                ext || 'The path ending'
              } extensioon does not match .html`,
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
