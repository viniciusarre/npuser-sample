"use strict";
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const db = new DB("sqlitedb")
const app = express();
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

app.use(allowCrossDomain)

// provide an API end point for ping. Use to verify your sample application is running

router.get('/', function(req, res) {
  console.log('GET request')
  res.status(200).send("Get request");
})

/* ****************  NP User Authentication ******************* */
const NoPasswordAuthorizer = require('npuser-client')

const npuserAuthorizer = new NoPasswordAuthorizer({
  baseUrl: config.NPUSER_URL,
  clientId: config.NPUSER_CLIENT_ID,
  sharedSecretKey: config.NPUSER_CLIENT_SECRET,
})

/*
Here is how you can user CURL to test your application's NP User authentication end points.

curl -d "email=sample@example.com" -X POST http://localhost:3000/sendNpUserAuth

Replace that email address with yours!

Create a json data file
data.json =

{ "email": "your email address", "authToken": "token from first curl request", "code": "code from your email"}

curl -d "@data.json" -H "Content-Type: application/json" -X POST http://localhost:3000/sendNpUserValidation
 */

// STEP 1 -- send auth request to NP User.  Extract and return the authorization token.
router.post('/sendNpUserAuth', function(req, res) {
  const email = req.body.email
  npuserAuthorizer.sendAuth(email)
  .then( (authResponse) => {
    const token = authResponse.token
    // console.log('Auth response:', authResponse)
    res.status(200).send({ token: token });
  }).catch((error) => { return res.status(500).send('Error on the server.'); })
})

// STEP 2 - combine the user email address, authorization token and validation code and finalize the user authorization
router.post('/sendNpUserValidation', function(req, res) {
  const {email, authToken, code } = req.body
  if (! email || ! authToken || ! code) {
    return res.status(400).send('Must provide email address, verification code and the authorization token');
  }
  npuserAuthorizer.sendValidation(email, authToken, code)
  .then( (validationResponse) => {
    if (validationResponse.token) {
      /*
      THAT'S IT!  You have either just registered a new user or a previous user has logged back in.
      From here on your application can manage the user account as needed.
      For this simple sample we will return a JWT signed by this application.
      This app can later verify its JWT and proceed if it is valid.
      This sample application will also insert a new user record if this is the first time.
      The JWT returned will contain the database id of the user.
       */
      const validationToken = validationResponse.token
      return sampleApplicationInsertUpdateUser(email, validationToken, res)
    } else {
      // the JWT from NPUser may have expired, the code may be wrong, or otherwise
      console.log('Auth validationResponse validationResponse:', validationResponse)
      return res.status(400).send('Validation did not succeed.');
    }
  }).catch((error) => { return res.status(500).send('Error on the server.'); })

})

/* ********************* END NP USER AUTHENTICATION **************** */

// 30 days
const EXPIRES = 60 * 60 * 24 * 30

function sampleApplicationInsertUpdateUser(email, validationToken, res) {
  console.log('Auth insertUpdateUser response:', email, validationToken)
  db.selectByEmail(email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (user) {
      console.log('Auth insertUpdateUser existing user')
      updateUser(user, res)
    } else {
      //Normally: return res.status(404).send('No user found.');
      // with NP User this situation is a new user!
      console.log('Auth insertUpdateUser NEW user')
      db.insert([email],
        function (err) {
          if (err) return res.status(500).send("There was a problem registering the user.")
          db.selectByEmail(email, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            updateUser(user, res)
          });
        });
    }
  });
}

function updateUser(user, res) {
  console.log('Auth updateUser user', user)
  let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: EXPIRES});
  res.status(200).send({ auth: true, token: token, user: user });

}


app.use(router)

let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
  console.log('Express server listening on port ' + port)
});
