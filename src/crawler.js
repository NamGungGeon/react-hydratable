const fs = require('fs');
const puppeteer = require('puppeteer');
const { delay, iife } = require('./utils');

const createUrlIterator = (host, urls) => {
  let idx = 0;

  return () => {
    if (urls.length - 1 >= idx) {
      idx++;
      return host + urls[idx - 1];
    }
    return null;
  };
};

const createDirs = (dirPath) => {
  const isExists = fs.existsSync(dirPath);
  if (!isExists) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const startCrawler = async (host, urls, outputRoot, delayTime, onFinished) => {
  console.log('Crawling: start');
  const browser = await puppeteer.launch({
    args: ['--disable-web-security'],
  });
  const page = await browser.newPage();

  const nextUrl = createUrlIterator(host, urls);

  let current = null;
  while ((current = nextUrl())) {
    const url = current;
    console.log('Crawling: [Start] ', url);
    await page.goto(url);

    await delay(delayTime);

    // Get the "viewport" of the page, as reported by the page.
    const htmlString = await page.evaluate(() => {
      return document.documentElement.innerHTML;
    });

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

    fs.writeFile(outputPath, htmlString, (e) => {
      if (e)
        console.error(
          'Crawling: Cannot write crawler output file to webroot path\n',
          e
        );
      else console.log(`Crawling: [OK] ${url}`);
    });
  }
  await browser.close();

  if (onFinished) onFinished();
  console.log('Crawling: end');
};

module.exports = startCrawler;
