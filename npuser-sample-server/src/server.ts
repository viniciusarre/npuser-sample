import express, {
  Request, Response, NextFunction, Express
} from 'express'
import { ApplicationError } from './errors/application-error'
import logger from './logger'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'

// CORS middleware
const allowCrossDomain = function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
}

// error handling middleware
const appError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }
  let status = 500
  if (err instanceof ApplicationError) { status = (err as ApplicationError).status }
  const errData = {
    message: err.message,
    status: status
  }
  logger.info('npuser: Error handler ' + JSON.stringify(errData))
  return res.status(status).json(errData)
}

export interface ApiProvider {
  addRoute (middleWare: express.RequestHandler[], app: Express): void
}

function createApp (middleWare: express.RequestHandler[], apiProviders: ApiProvider[]) {
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
// TODO  insert the valid user handler into the constructor of SampleNpUserAuthorizer
const apiUser = new SampleNpUserAuthorizer()

const apiProviders = [apiUser]

const app = createApp(middleWare, apiProviders)

const serverPort = process.env.PORT || 3000
app.listen(serverPort, async () => {
  console.log(`NP User SAMPLE server listening on port ${serverPort}`)
})
