import * as path from 'path';

const originalError = console.error;
const originalLog = console.log;
const originalInfo = console.info;
const originalWarn = console.warn;

function getRelativeFilePath(filePath: string): string {
  const projectRoot = path.resolve(__dirname, '../../'); // Adjust the relative path based on your project structure
  const relativePath = path.relative(projectRoot, filePath);
  return relativePath;
}

function decorate(original: Function, ...args: []) {
  const timestamp = new Date().toLocaleTimeString();
  const stackTrace = new Error().stack
    ?.split("\n")[3]
    .trim()
    .replace(/^at /, "");
  const fileInfo = stackTrace?.match(/\((.+)\)/)?.[1] || "unknown";
  const relativePath = getRelativeFilePath(fileInfo);

  original(`[${original.name} | ${timestamp} | ${relativePath} ]:`, ...args);
}

function log(...args: []) {
  decorate(originalLog, ...args);
}

function error(...args: []) {
  decorate(originalError, ...args);
}

function info(...args: []) {
  decorate(originalInfo, ...args);
}

function warn(...args: []) {
  decorate(originalWarn, ...args);
}

globalThis.console.log = log;
globalThis.console.error = error;
globalThis.console.info = info;
globalThis.console.warn = warn;
