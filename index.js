#!/usr/bin/env node

const createHttpServer = require('./src/webserver');
const startCrawler = require('./src/crawler');

const params = require('./src/params');

const args = process.argv.slice(2);

if (args.includes('--preview')) {
  //preview mode
  createHttpServer(params.webroot, params.port);
  return;
}

//crawling mode
const closeHttpServer = createHttpServer(params.webroot, params.port, () =>
  startCrawler(
    params.host + ':' + params.port,
    params.crawlingUrls,
    params.webroot,
    params.delay
  )
    .catch((e) => {
      console.error('Crawling: error\n', e);
    })
    .finally(closeHttpServer)
);
