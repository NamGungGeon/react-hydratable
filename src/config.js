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
  pageCount: 1,
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

    //validation
    if (!params.webroot || typeof params.webroot !== 'string') {
      throw 'webroot must be non-empty string';
    }
    if (!params.host || typeof params.host !== 'string') {
      throw 'host must be non-empty string';
    }
    if (params.port <= 0) {
      throw 'port must be bigger than 0';
    }
    if (!Array.isArray(params.crawlingUrls)) {
      throw 'crawlingUrls must be string array';
    }
    if (typeof params.delay !== 'number') {
      throw 'delay must be number';
    }
    if (typeof params.userAgent !== 'string') {
      throw 'userAgent must be string';
    }
    if (typeof params.htmlPrefix !== 'string') {
      throw 'htmlPrefix must be string';
    }
    if (typeof params.pageCount !== 'number' || params.pageCount <= 0) {
      throw 'pageCount must be number and bigger than 0';
    }
  }
} catch (e) {
  console.error('Cannot read hydratable.config.json');
  throw e;
}

console.log('react-hydratable: Config is here\n', params);

module.exports = params;
