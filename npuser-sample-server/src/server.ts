import express, { Express, Response } from 'express'
import { appErrorMiddleWare } from './errors/application-error'
import { allowCrossDomain } from './cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import compression from 'compression'
import { SampleNpUserAuthorizer, UserAuthCallback } from './np'

export interface ApiProvider {
  addRoute (middleWare: express.RequestHandler[], app: Express): void
}

function createApp (middleWare: express.RequestHandler[], apiProviders: ApiProvider[]) {
  const eApp = express()
  eApp.use(helmet())
  eApp.use(compression())
  eApp.use(bodyParser.urlencoded({ extended: true }))
  eApp.use(bodyParser.json({ limit: '5mb', type: 'application/json' }))
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
  eApp.use(appErrorMiddleWare)
  return eApp
}

const middleWare = [allowCrossDomain]
const userCallback:UserAuthCallback = (email: string, token: string, response: Response): Promise<object> => {
  console.log('userCallback', email, token)
  return Promise.resolve({})
}

// // TODO  insert the valid user handler into the constructor of SampleNpUserAuthorizer
const apiUser = new SampleNpUserAuthorizer(userCallback)

const apiProviders: ApiProvider[] = [apiUser]

const app = createApp(middleWare, apiProviders)

const serverPort = process.env.PORT || 3000
app.listen(serverPort, async () => {
  console.log(`NP User SAMPLE server listening on port ${serverPort}`)
})
