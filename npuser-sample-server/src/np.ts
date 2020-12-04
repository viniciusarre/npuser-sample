import {
  Request, Response, NextFunction
} from 'express'
// const NoPasswordAuthorizer = require('npuser-client')
import NoPasswordAuthorizer, { AuthResponse, ValidationResponse } from '../../../npuser-client/dist'
const { sendResponse } = require('./response-handlers')
const { Router } = require('express')
const { BadRequest, InvalidRequest } = require('./errors/application-error')
const verbose = true

const { NPUSER_CLIENT_ID } = process.env // the api key this app uses to connect with the npuser.org service
const { NPUSER_CLIENT_SECRET } = process.env // the shared secret this app uses to send encrypted data to npuser
const { NPUSER_URL } = process.env // the npuser service url with? or without? trailing slash

const npuserAuthorizer = new NoPasswordAuthorizer({
  baseUrl: NPUSER_URL,
  clientId: NPUSER_CLIENT_ID,
  sharedSecretKey: NPUSER_CLIENT_SECRET,
  verbose: verbose // controls the verbosity of the np client library
})

class SampleNpUserAuthorizer /* implements ApiProvider */ {
  /**
   *
   * @param userValidatedResponseHandler function (email, validationToken, res)
   */
  constructor (userValidatedResponseHandler) {
    this.userValidatedResponseHandler = userValidatedResponseHandler
  }

  userAuth () {
    return (req: Request, res: Response) => {
      const email = req.body.email
      if (verbose) console.log('npuser-sample-server: step 1 request with email:', email)
      npuserAuthorizer.sendAuth(email)
        .then((authResponse: AuthResponse) => {
          const token = authResponse.token
          if (verbose) console.log('npuser-sample-server:  step 1 response:', authResponse)
          sendResponse(res, { token: token })
        })
    }
  }

  userValidate (userValidatedResponseHandler) {
    return (req: Request, res: Response) => {
      const { email, authToken, code } = req.body
      if (!email || !authToken || !code) {
        throw BadRequest('Must provide email address, verification code and the authorization token')
      }
      if (verbose) console.log('npuser-sample-server: step 2 request with:', email, code, authToken)
      return npuserAuthorizer.sendValidation(email, authToken, code)
        .then((validationResponse: ValidationResponse) => {
          if (validationResponse.jwt) {
            if (verbose) console.log('npuser-sample-server: User has been validated by NP User')
            /*
          THAT'S IT!  You have either just registered a new user or a previous user has logged back in.
          From here on your application can manage the user account as needed.
          For this simple sample we will return a JWT signed by this application.
          This app can later verify its JWT and proceed if it is valid.
          This sample application will also insert a new user record if this is the first time.
          The JWT returned will contain the database id of the user.
           */
            if (userValidatedResponseHandler) {
              const validationToken = validationResponse.jwt
              return userValidatedResponseHandler(email, validationToken, res)
            }
          } else {
            if (verbose) console.log('npuser-sample-server:  step 2 response:', validationResponse)
            throw InvalidRequest(validationResponse.message)
          }
        })
    }
  }

  route () {
    const router = Router()
    // STEP 1 -- post to /user/auth with email address will return the authorization token.
    router.post('/auth', wrapAsync(this.userAuth()))

    // STEP 2 - post to /user/validate. Send email address, authorization token and validation code and finalize the user authorization
    router.post('/validate', wrapAsync(this.userValidate(this.userValidatedResponseHandler)))
    return router
  }

  // addRoute (middleWare: [express.RequestHandler], app: express.Express): void {
  addRoute (middleWare, app) {
    app.use('/user', middleWare, this.route())
  }
}

function wrapAsync (fn/*: express.RequestHandler */) {
  // return function (req: Request, res: Response, next: NextFunction) {
  return function (req, res, next) {
    // `.catch()` any errors and pass them along to the `next()`
    fn(req, res, next).catch((err) => {
      console.log('in wrap async catch with error', err.message)
      return next(err)
    })
  }
}

module.exports = SampleNpUserAuthorizer
/*
Here is how you can user CURL to test your application's NP User authentication end points.

curl -d "email=sample@example.com" -X POST http://localhost:3000/user/auth

Replace that email address with yours!

Create a json data file
data.json =

{ "email": "your email address", "authToken": "token from first curl request", "code": "code from your email"}

curl -d "@data.json" -H "Content-Type: application/json" -X POST http://localhost:3000/user/validate
 */
