"use strict";
const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const setupNP = require('./np')
const { setupApp, sampleApplicationInsertUpdateUser } = require('./app')

const server = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}
server.use(allowCrossDomain)

// API end point for ping.
router.get('/', function(req, res) {
  console.log('GET request')
  res.status(200).send("Get request");
})

// Sample application
setupApp(config)

// NP User Authentication
setupNP(config, router, sampleApplicationInsertUpdateUser)

server.use(router)

let port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('NP User sample application server listening on port ' + port)
});
