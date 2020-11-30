// const NoPasswordAuthorizer = require('npuser-client')
const NoPasswordAuthorizer = require('../../npuser-client/dist')
const {sendErr, sendResponse} = require('./response-handlers')

const AUTH_END_POINT = '/sendNpUserAuth'
const VALIDATION_END_POINT = '/sendNpUserValidation'

const verbose = true

/** *******************************
 * Setup the NP User Authentication API
 * @param config
 * @param router
 * @param userValidatedResponseHandler
 */
function setupNP(config, router, userValidatedResponseHandler) {

  config.NPUSER_URL = 'http://localhost:27001'

  const npuserAuthorizer = new NoPasswordAuthorizer({
    baseUrl: config.NPUSER_URL,
    clientId: config.NPUSER_CLIENT_ID,
    sharedSecretKey: config.NPUSER_CLIENT_SECRET,
    verbose: verbose // controls the verbosity of the np client library
  })

  // STEP 1 -- send auth request to NP User.  Extract and return the authorization token.
  router.post(AUTH_END_POINT, function (req, res) {
    const email = req.body.email
    if (verbose) console.log('Auth request with email:', email)
    npuserAuthorizer.sendAuth(email)
    .then((authResponse) => {
      const token = authResponse.token
      if (verbose) console.log('Auth response:', authResponse)
      sendResponse(res, {token: token});
    }).catch((error) => { return sendErr(res, 500, 'Error on the server.', error); })
  })

  // STEP 2 - combine the user email address, authorization token and validation code and finalize the user authorization
  router.post(VALIDATION_END_POINT, function (req, res) {
    const {email, authToken, code} = req.body
    if (!email || !authToken || !code) {
      return sendErr(res, 400, 'Must provide email address, verification code and the authorization token');
    }
    if (verbose) console.log('Validation request with:', email, code, authToken)
    npuserAuthorizer.sendValidation(email, authToken, code)
    .then((validationResponse) => {
      if (validationResponse.jwt) {
        if (verbose) console.log('User has been validated by NP User')
        /*
        THAT'S IT!  You have either just registered a new user or a previous user has logged back in.
        From here on your application can manage the user account as needed.
        For this simple sample we will return a JWT signed by this application.
        This app can later verify its JWT and proceed if it is valid.
        This sample application will also insert a new user record if this is the first time.
        The JWT returned will contain the database id of the user.
         */
        const validationToken = validationResponse.jwt
        return userValidatedResponseHandler(email, validationToken, res)
      } else {
        // the JWT from NPUser may have expired, the code may be wrong, or otherwise
        if (verbose) console.log('Auth validationResponse validationResponse:', validationResponse)
        return sendErr(res, 400, 'Validation did not succeed.');
      }
    }).catch((error) => { return sendErr(res, 500, 'Error on the server.', error); })
  })
}

module.exports = setupNP
/*
Here is how you can user CURL to test your application's NP User authentication end points.

curl -d "email=sample@example.com" -X POST http://localhost:3000/sendNpUserAuth

Replace that email address with yours!

Create a json data file
data.json =

{ "email": "your email address", "authToken": "token from first curl request", "code": "code from your email"}

curl -d "@data.json" -H "Content-Type: application/json" -X POST http://localhost:3000/sendNpUserValidation
 */
