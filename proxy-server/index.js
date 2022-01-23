const http = require("http");
const httpProxy = require("http-proxy");
const url = require("url");

const proxy = httpProxy.createProxyServer();

// eslint-disable-next-line handle-callback-err
proxy.on("error", (err, req, res) => {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });

  console.log(err);

  res.end("Something went wrong. And we are reporting a custom error message.");
});

const FRONT_URL = process.env.FRONT_URL;
const BACK_URL = process.env.BACK_URL;

const products = [
  {
    // front
    name: "front",
    target: FRONT_URL,
    path: "/",
  },
  {
    // back
    name: "back",
    target: BACK_URL,
    path: "/api", // sm, static
  },
];

http
  .createServer((req, res) => {
    const parsedURL = url.parse(req.url);

    // нахождение всех продуктов, пути которых, являются саб путями запорса
    const product_filtered = products.filter((prd) =>
      parsedURL.path.startsWith(prd.path)
    );
    // нахождение продукта с самым длинным путём
    const product_max = product_filtered.reduce((p, n) =>
      p.path.length < n.path.length ? n : p
    );

    if (product_max) return proxy.web(req, res, { target: product_max.target });
    return proxy.web(req, res, { target: products[0].target });
  })
  .listen(4000);
