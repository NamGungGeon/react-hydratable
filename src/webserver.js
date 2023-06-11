const http = require('http');
const fs = require('fs');

const createHttpServer = (webroot, port, onReady) => {
  const server = http.createServer((req, res) => {
    const { url } = req;

    //remove query string from url
    let path = url.split('?')[0];

    if (path[path.length - 1] === '/') {
      //if end with / (point to index.html)
      //if not specify file extension
      path += 'index.html';
    } else if (path.split('/').reverse()[0].split('.').length === 1) {
      path += '/index.html';
    }

    path = webroot + path;
    path = decodeURI(path);

    try {
      //static page or crawled page
      if (fs.existsSync(path)) {
        res.end(fs.readFileSync(path));
      }
      //dynamic (routing) page or not crawled page
      else {
        res.end(fs.readFileSync(webroot + '/index.html'));
      }
    } catch (e) {
      console.error(e);
      res.writeHead(404).end();
    }
  });

  server.listen(port, function () {
    console.log(`createHttpServer: ready (PORT ${port})`);
    if (onReady) onReady();
  });
  console.log('createHttpServer: server is started');

  const destroyServer = () =>
    server.close((e) => {
      if (e) {
        console.error('createHttpServer: Cannot close server', e);
      } else {
        console.log('createHttpServer: server is closed');
      }
    });
  return destroyServer;
};

module.exports = createHttpServer;
