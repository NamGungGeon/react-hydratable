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

module.exports = {
  delay,
  iife,
};
