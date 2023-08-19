#!/usr/bin/env node

const createHttpServer = require('./src/webserver');
const startCrawler = require('./src/crawler');

const config = require('./src/config');

const args = process.argv.slice(2);

if (args.includes('--preview')) {
  //preview mode
  createHttpServer(config.webroot, config.port);
  return;
}

//crawling mode
const closeHttpServer = createHttpServer(config.webroot, config.port, () =>
  startCrawler(
    config.port ? config.host + ':' + config.port : config.host,
    config.crawlingUrls,
    config.webroot,
    config.delay,
    config.userAgent,
    config.htmlPrefix,
    config.pageCount
  )
    .catch((e) => {
      console.error('Crawling: [error]\n', e);
    })
    .finally(closeHttpServer)
);
