const fs = require('fs');

const delay = (ms = 1000) => {
  return new Promise((rs, rj) => {
    setTimeout(() => {
      rs();
    }, ms);
  });
};

const iife = (func) => {
  return func();
};

const createDirs = (dirPath) => {
  const isExists = fs.existsSync(dirPath);
  if (!isExists) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

module.exports = {
  delay,
  iife,
  createDirs,
};
