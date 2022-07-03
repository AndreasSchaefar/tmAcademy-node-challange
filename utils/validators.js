import { basename } from 'path';

function isHtml(ext) {
  return ext === 'html';
}

function isJson(ext) {
  return ext === 'json';
}

function isYaml(ext) {
  return ext === 'yaml';
}

function validateTemplateIsHtml(templatePath) {
  const [_, ext] = basename(templatePath).split('.');
  const valid = isHtml(ext);
  return [valid, ext];
}

function validateFileJsonYaml(filePath) {
  const [_, ext] = basename(filePath).split('.');
  const valid = isJson(ext) || isYaml(ext);
  return [valid, ext];
}

export {
  validateFileJsonYaml,
  validateTemplateIsHtml,
  isHtml,
  isJson,
  isYaml,
};
