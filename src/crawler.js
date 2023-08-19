const fs = require('fs');
const puppeteer = require('puppeteer');
const { delay, iife } = require('./utils');

const createDirs = (dirPath) => {
  const isExists = fs.existsSync(dirPath);
  if (!isExists) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const crawlingOnePage = async (
  page,
  url,
  host,
  outputRoot,
  delayTime,
  htmlPrefix
) => {
  console.log('Crawling: [Start] ', url);
  await page.goto(url);

  await delay(delayTime);

  const htmlString = await page.evaluate(() => {
    if (document.contentType !== 'text/html') {
      return {
        error: 'page is not text/html type',
      };
    }
    return document.documentElement.innerHTML;
  });
  if (htmlString.error) {
    console.error(`Crawling: [Error] ${url} ${htmlString.error}`);
    return;
  }

  let path = url.replace(host, '');
  if (path[path.length - 1] === '/') {
    //if end with / (point to index.html)
    path += 'index.html';
  } else if (path.split('/').reverse()[0].split('.').length === 1) {
    //if not specify file extension
    path += '/index.html';
  }

  const outputPath = outputRoot + path;
  const outputDir = iife(() => {
    const dirs = `${outputPath}`.split('/');
    dirs.splice(dirs.length - 1, 1);

    return dirs.join('/');
  });

  createDirs(outputDir);

  fs.writeFile(outputPath, htmlPrefix + htmlString, (e) => {
    if (e)
      console.error(
        'Crawling: Cannot write crawler output file to webroot path\n',
        e
      );
    else console.log(`Crawling: [OK] ${url}`);
  });
};

const startCrawler = async (
  host,
  urls,
  outputRoot,
  delayTime,
  userAgent,
  htmlPrefix
) => {
  console.log('Crawling: start');

  const browser = await puppeteer.launch({
    args: ['--disable-web-security'],
  });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);

  for (const pathname of urls) {
    const url = host + pathname;
    await crawlingOnePage(page, url, host, outputRoot, delayTime, htmlPrefix);
  }

  await browser.close();

  console.log('Crawling: end');
};

module.exports = startCrawler;
