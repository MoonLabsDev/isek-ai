import fs from 'fs';
import path from 'path';

import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';

import { Server } from 'socket.io';

import { character_routes, world_routes } from './routes';
import { setup_websocket } from './websocket';

import { global } from './globals';

// ssl options
const keyFile = path.join(__dirname, '../localhost-key.pem');
const certFile = path.join(__dirname, '../localhost.pem');
const sslOptions: null | { key: Buffer; cert: Buffer } =
  fs.existsSync(keyFile) && fs.existsSync(certFile)
    ? {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile),
      }
    : null;

// init
const app = express();
const httpServer = http.createServer(app);
const httpsServer = sslOptions ? https.createServer(sslOptions, app) : null;
const ioHttp = new Server(httpServer, {
  cors: { origin: '*' },
});
const ioHttps = httpsServer
  ? new Server(httpsServer, {
      cors: { origin: '*' },
    })
  : null;

// middlewares
app.use(cors());
app.use(express.json());

// init global
global.db.connect();
global.ai.init();

// force https
const FORCE_HTTPS = process.env.FORCE_HTTPS === 'true';
if (FORCE_HTTPS && httpsServer) {
  app.use((req, res, next) => {
    if (req.secure) next();
    else res.redirect(`https://${req.headers.host}${req.url}`);
  });
}

// routes
world_routes(app);
character_routes(app);

// websocket
setup_websocket(ioHttp);
if (ioHttps) setup_websocket(ioHttps);

// start server
const PORT_HTTP = process.env.PORT || 3001;
httpServer.listen(PORT_HTTP, () => {
  console.log(`Server listening on http://localhost:${PORT_HTTP}`);
});
if (httpsServer) {
  const PORT_HTTPS = process.env.PORT_HTTPS || 3002;
  httpsServer.listen(PORT_HTTPS, () => {
    console.log(`Server listening on https://localhost:${PORT_HTTPS}`);
  });
}
