const literalsRegex = /(?<=\$\().*?(?=\))/;
const templateRegex = /\$\(([^)]+)\)/g;

export { literalsRegex, templateRegex };
