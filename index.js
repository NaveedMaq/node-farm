const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const populateTemplate = require('./modules/populateTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj.map((el) => populateTemplate(templateCard, el)).join('');

    const overviewHtml = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(overviewHtml);

    // Product page
  } else if (pathname.startsWith('/product/')) {
    const productNameSlug = pathname.slice('/product/'.length);

    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const product = dataObj.find(
      (product) => slugify(product.productName, { lower: true }) === productNameSlug
    );
    const productHtml = populateTemplate(templateProduct, product);
    res.end(productHtml);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => console.log('Listening to requests on port 8000'));
