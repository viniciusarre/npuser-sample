// const NoPasswordAuthorizer = require('npuser-client')
const NoPasswordAuthorizer = require('../../npuser-client/dist')
const {sendErr, sendResponse} = require('./response-handlers')
const { Router } = require('express')

const verbose = true

const { NPUSER_CLIENT_ID, NPUSER_CLIENT_SECRET, NPUSER_URL } = process.env

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

  userAuth (req, res, next) {
    const email = req.body.email
    if (verbose) console.log('npuser-sample-server: step 1 request with email:', email)
    npuserAuthorizer.sendAuth(email)
    .then((authResponse) => {
      const token = authResponse.token
      if (verbose) console.log('npuser-sample-server:  step 1 response:', authResponse)
      sendResponse(res, {token: token});
    }).catch((error) => {
      if (verbose) console.log('npuser-sample-server:  error', error.message, error.status)
      // return sendErr(res, error.status || 500, error.message || 'Error on the server.')
      next(error)
    })
  }

  userValidate (req, res) {
    const {email, authToken, code} = req.body
    if (!email || !authToken || !code) {
      return sendErr(res, 400, 'Must provide email address, verification code and the authorization token');
    }
    if (verbose) console.log('npuser-sample-server: step 2 request with:', email, code, authToken)
    npuserAuthorizer.sendValidation(email, authToken, code)
    .then((validationResponse) => {
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
        const validationToken = validationResponse.jwt
        return this.userValidatedResponseHandler(email, validationToken, res)
      } else {
        // the JWT from NPUser may have expired, the code may be wrong, or otherwise
        if (verbose) console.log('npuser-sample-server:  step 2 response:', validationResponse)
        return sendErr(res, validationResponse.status, validationResponse.message);
      }
    }).catch((error) => { return sendErr(res, 500, 'Error on the server.', error); })
  }

  route () {
    const router = Router()
    // STEP 1 -- post to /user/auth with email address will return the authorization token.
    router.post('/auth', this.userAuth)

    // STEP 2 - post to /user/validate. Send email address, authorization token and validation code and finalize the user authorization
    router.post('/validate', this.userValidate)
    return router
  }

  // addRoute (middleWare: [express.RequestHandler], app: express.Express): void {
  addRoute (middleWare, app) {
    app.use('/user', middleWare, this.route())
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
