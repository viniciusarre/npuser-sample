"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

// CORS middleware
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}

// error handling middleware
const appError = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.log('npuser: Error handler received error ' + JSON.stringify(err))
  const status = err.status || 500
  const errData = {
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message,
    status: status
  }
  console.log('npuser: Error handler ' + JSON.stringify(errData))
  return res.status(status).json(errData)
}
/*
export interface ApiProvider {
  addRoute (middleWare: express.RequestHandler[], app: Express): void
}
*/
function createApp (middleWare/*: express.RequestHandler[]*/, apiProviders/*: ApiProvider[]*/) {
  const eApp = express()
  eApp.use(helmet())
  eApp.use(compression())
  eApp.use(bodyParser.urlencoded({ extended: true }))
  eApp.use(bodyParser.json())
  // eApp.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))
  apiProviders.forEach((provider) => {
    provider.addRoute(middleWare, eApp)
  })
  eApp.get('/', (req, res) => {
    console.log(`npuser-sample: get / call ip: ${req.ip}`)
    res.status(200).send({ message: 'npuser sample service is up and running' })
  })

  // add error handling middleware last.
  // See https://thecodebarbarian.com/80-20-guide-to-express-error-handling
  eApp.use(appError)
  return eApp
}

const middleWare = [allowCrossDomain]

const SampleNpUserAuthorizer = require('./np')
const apiUser = new SampleNpUserAuthorizer()

const apiProviders = [apiUser]

const app = createApp(middleWare, apiProviders)

const serverPort = process.env.PORT || 3000;
app.listen(serverPort, async () => {
  console.log(`NP User SAMPLE server listening on port ${serverPort}`)
})

