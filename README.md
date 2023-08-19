# react-hydratable

`react-hydratable` is nodejs module for improving SEO performance of SPA project.

In React, `npm run build` create build outputs.

But `index.html` has just blank body. Because in SPA framework(ex: react) javascript file will render html elements.

In SPA with CSR, SEO performance is very poor. Of course, SSR framework(ex: nextjs) can solve this problem, but some project cannot be moved from CSR to SSR because of various problems.

In this case, `react-hydratable` can be very powerful weapon.

`react-hydratable` just create simple http webserver based on your SPA build output, and starting crawling html after executing javascript. Finally crawled html data is saved to appropriate build path.

So, After executing `react-hydratable`, `index.html` is prerendered.

It has fullfilled body.

Now every search bot(that cannot execute javascript, just read html file) can collect your website informations!!

## Installation

1. install module from npm
   `npm install -D react-hydratable`

2. setup
   Go to your project root and open `src/index.js`

   ```javascript
   import React from 'react';
   import { hydrate, render } from 'react-dom';

   // ...

   //update here
   //optional render/hydrate
   if (rootElement.hasChildNodes()) {
     hydrate(element, rootElement);
   } else {
     render(element, rootElement);
   }
   ```

If user access crawled page, `???/html` has been filled body. So browser need not break all DOM and re-render all elements.

Browser can use already-made-DOM objects. `hydrate()` function support this.

That's all! `react-hydratable` is ready!!

## Start Crawling

`react-hydratable` use `/build` files.

Add `react-hydratable` script to your `package.json`.

`package.json`

```json
{
  "...": "...",
  "scripts": {
    "...": "...",
    //add new scripts
    "postbuild": "react-hydratable"
  },
  "...": "..."
}
```

This script(postbuild) means that run `react-hydratable` after `build` script is finished.

What a so simple usage.

You just type `npm run build` to terminal.

`react-hydratable` will be executed automatically after building project.

## Preview prerendered pages

Do you wonder your prerendered pages are working correctly?

`react-hydratable` support "preview mode".

// package.json

```json
{
  "...": "...",
  "scripts": {
    "...": "...",
    //add new scripts
    "preview": "react-hydratable --preview"
  },
  "...": "..."
}
```

Now, you can check your prerendered pages after type `npm run preview` to terminal.

## (Optional) Customize configurations

react-hydratable has default config.

```json
{
  "webroot": "./build",
  "host": "http://localhost",
  "port": 3000,
  "crawlingUrls": ["/"],
  "delay": 1500,
  "htmlPrefix": "<!DOCTYPE html>"
}
```

If you want customize settings(ex: I want to crawl html about more url), create `hydratable.config.json` to project root(same level with `package.json`).

Explaination of all configurations is at page bottom.

#### Set crawling targets(urls)

```json
//hydratable.config.json
{
  "crawlingUrls": ["/", "/copyrights"]
}
```

As this configuration, `react-hydratable` start crawling '/' and '/copyrights'.

And also, create new html file(`build/copyrights/index.html`) and refresh default index.html file(`build/index.html`).

Default `crawlingUrls` value is `['/']` (only crawling `/build/index.html` and refresh it)

**Keep in mind "all type of crawlingUrl must be text/html"**

**Other Content-Type is not accepted**

### Set crawling delay

In crawling phase, load html and wait for `delay`.

After finishing loading, maybe `html` is not perfecttly loadded.

For example, if target page uses `ajax`, `html` is not perfect before `ajax` is finished.

So `react-hydratable` solve this problem as waiting some time.

Default waiting time is `1500`ms.

If you want increase delay from 1500ms to 2000ms, override `delay` property.

`hydratable.config.json`

```json
{
  "delay": 2000
}
```

Now `react-hydratable` wait 2000 ms after loading page.

### Set multi-page crawling

If you have a lot of page that will be crawling(crawlingUrls), it takes many time.

In this case, you can use multi-page crawling.

Default value is 1, this means one page(one window) is used to crawl your `crawlingUrls`.

You can increase page(window) count as increase `pageCount` value.

But if `pageCount` gets too big, server may be slow and also crawling result be wrong.

Recommend set between 1~4.

### All configurations

```json
{
  "webroot": "/your_project_root/build",
  "host": "http://localhost",
  "port": 3000,
  "crawlingUrls": ["/"],
  "delay": 1500,
  "userAgent": "react-hydratable",
  "htmlPrefix": "<!DOCTYPE html>",
  "pageCount": 1
}
```

`webroot`: react build directory path

`host`: webserver host (http only)

`port`: webserver port

`crawlingUrls`: crawling target url list

`delay`: wait time(ms) after page is loaded

`userAgent`: crawler user-agent (request header)

`htmlPrefix`: prefix string that is added crawling result (if blank, `<!DOCTYPE html>` is not included)

`pageCount`: multi-page crawling is support. if you increase this value, crawling speed is up, but may stress to server.
