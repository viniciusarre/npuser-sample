import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const DB = require('./db')
const { sendResponse } = require('./response-handlers')

const { MY_APP_TOKEN_SECRET } = process.env // the api key this app uses to connect with the npuser.org service

// Once a user is validated the have access, when using the same browser, for ___ days
const EXPIRES = 60 * 60 * 24 // * 1 day

const verbose = true

let database: any
function getDb () {
  if (!database) { database = new DB('sqlitedb') }
  return database
}

export function sampleApplicationUserHandler (req: Request, res: Response, next: NextFunction) {
  const { email, validationToken } = req.body
  if (verbose) console.log('npuser-sample-server:  insertUpdateUser ', email, validationToken)
  const updateUser = (user: any, res: Response) => {
    if (verbose) console.log('npuser-sample-server:  updateUser user', user)
    const token = jwt.sign({ id: user.id }, MY_APP_TOKEN_SECRET, { expiresIn: EXPIRES })
    sendResponse(res, { auth: true, token: token, user: user })
  }
  const db = getDb()
  db.selectByEmail(email, (err: Error, user: any) => {
    if (err) return next(err)
    if (user) {
      if (verbose) console.log('npuser-sample-server: existing user')
      updateUser(user, res)
    } else {
      if (verbose) console.log('npuser-sample-server: NEW user')
      db.insert([email], (err: Error) => {
        if (err) return next(err)
        db.selectByEmail(email, (err: Error, user: any) => {
          if (err) return next(err)
          return updateUser(user, res)
        })
      })
    }
  })
}
