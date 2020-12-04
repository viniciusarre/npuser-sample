
// export class ApplicationError extends Error {
//   message = 'ApplicationError'
//
//   status = 500
//
//   constructor (message, status) {
//     super()
//     if (message != null) {
//       this.message = message
//     }
//     if (status != null) {
//       this.status = status
//     }
//   }
// }

// export class BadRequest extends ApplicationError {
//   constructor (message) {
//     super(message || 'Bad request', 400)
//   }
// }
//
// export class InvalidRequest extends ApplicationError {
//   constructor (message) {
//     super(message || 'Invalid request', 401)
//   }
// }
//
// export class ExpiredRequest extends ApplicationError {
//   constructor (message) {
//     super(message || 'Expired request', 403 /* forbidden, understood but will not accept */)
//   }
// }

function createError(message, status) {
  let err = new Error(message)
  err.status = status || 400
  console.log('make error', err)
  return err
}

function BadRequest(message) {
  return createError(message,400)
}
function InvalidRequest(message) {
  return createError(message,401)
}
function ExpiredRequest(message) {
  return createError(message,403)
}

module.exports = {BadRequest, InvalidRequest, ExpiredRequest}
