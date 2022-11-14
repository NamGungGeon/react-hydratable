const fs = require('fs');

console.log('react-hydratable: Config build...');

const projectRoot = process.cwd();
const params = {
  webroot: projectRoot + '/build',
  host: 'http://localhost',
  port: 3000,
  crawlingUrls: ['/'],
  delay: 1500,
  userAgent: 'react-hydratable',
  htmlPrefix: '<!DOCTYPE html>',
};

try {
  const configFileName = 'hydratable.config.json';
  if (fs.existsSync(projectRoot + '/' + configFileName)) {
    //exist config file
    const config = JSON.parse(
      fs.readFileSync(projectRoot + '/' + configFileName)
    );
    for (const configKey in config) {
      params[configKey] = config[configKey];
    }
  }
} catch (e) {
  console.error('Cannot read hydratable.config.json');
  console.error(e);
}

console.log('react-hydratable: Config is here\n', params);

module.exports = params;
