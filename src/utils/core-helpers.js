const fs = require('fs');
const path = require('path');

/**
 * Requires all modules in the given directory.
 *
 * @param {string} directory The directory to require modules from.
 * @return {object} An object containing all the required modules.
 */
function requireAll(directory) {
  const modules = {};
  const mainPath = require.main.path;
  const modulesPath = path.resolve(mainPath, directory);

  fs.readdirSync(modulesPath).forEach((file) => {
    const filePath = path.join(modulesPath, file);
    const fileName = path.basename(file, path.extname(file));

    if (fileName !== 'index' && fs.statSync(filePath).isFile()) {
      const moduleName = camelCase(fileName);
      modules[moduleName] = require(filePath);
    }
  });

  return modules;
}

/**
 * Converts a string to camel case.
 *
 * @param {string} str The string to convert.
 * @returns {string} The converted string.
 */
function camelCase(str) {
  const words = str.split(/[.-]/);
  const formattedWords = words.map((str, i) => {
    return (
      (i === 0 ? str.charAt(0).toLowerCase() : str.charAt(0).toUpperCase()) +
      str.slice(1)
    );
  });

  return formattedWords.join('');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const chalk = {
  green: (str) => `\x1b[92m${str}\x1b[0m`,
  red: (str) => `\x1b[31m${str}\x1b[0m`,
  yellow: (str) => `\x1b[33m${str}\x1b[0m`,
  inversed: (str) => `\x1b[7m${str}\x1b[0m`,
};


const helpers = { requireAll, camelCase, capitalize, chalk };

module.exports = helpers;
