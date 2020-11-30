"use strict";
const DB = require('./db');
const config = require('./config');
const jwt = require('jsonwebtoken');
const {sendErr, sendResponse} = require('./response-handlers')

// 30 days
const EXPIRES = 60 * 60 * 24 * 30
let TOKEN_SECRET

function setupApp(config) {
  TOKEN_SECRET = config.MY_APP_TOKEN_SECRET
}

let database
function getDb() {
  if (!database)
    database = new DB("sqlitedb")
  return database
}

function sampleApplicationInsertUpdateUser(email, validationToken, res) {
  console.log('Auth insertUpdateUser response:', email, validationToken)
  let db = getDb()
  db.selectByEmail(email, (err, user) => {
    if (err) return sendErr(res,500,'Error on the server.', err);
    if (user) {
      console.log('Auth insertUpdateUser existing user')
      updateUser(user, res)
    } else {
      //Normally: return res.status(404).send('No user found.');
      // with NP User this situation is a new user!
      console.log('Auth insertUpdateUser NEW user')
      db.insert([email],
        function (err) {
          if (err) return sendErr(res,500,"There was a problem registering the user.", err)
          db.selectByEmail(email, (err,user) => {
            if (err) return sendErr(res,500,"There was a problem getting user", err)
            updateUser(user, res)
          });
        });
    }
  });
}

function updateUser(user, res) {
  console.log('Auth updateUser user', user)
  let token = jwt.sign({ id: user.id }, TOKEN_SECRET, {expiresIn: EXPIRES});
  sendResponse(res,{ auth: true, token: token, user: user });
}

module.exports = {setupApp, sampleApplicationInsertUpdateUser}
