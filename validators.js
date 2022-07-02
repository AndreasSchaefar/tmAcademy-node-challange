import { basename } from "path";

function validateTemplateIsHtml(templatePath) {
  const [_, ext] = basename(templatePath).split(".");
  const valid = ext === "html";
  return [valid, ext];
}

function validateFileJsonYaml(filePath) {
  const [_, ext] = basename(filePath).split(".");
  const valid = ext === "json" || ext === "yaml";
  return [valid, ext];
}

export { validateFileJsonYaml, validateTemplateIsHtml };
