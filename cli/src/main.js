import NoPasswordAuthorizer from 'npuser-client'
// import NoPasswordAuthorizer from '../../npuser-client/dist'
import readline from 'readline'
import config from './config-env'
console.log('the env contains', config)

async function getCodeFromUser () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise(resolve => {
    rl.question('What is the verification code? (Ctrl-C or enter nothing to stop) ', function (code) {
      rl.close()
      resolve(code)
    })
  })
}

async function main () {
  const np = new NoPasswordAuthorizer({
    baseUrl: config.NPUSER_URL,
    clientId: config.CLIENT_ID,
    sharedSecretKey: config.SECRET,
    silent: true,
    dev: config.DEV === 'true'
  })

  const emailAddress = config.USER_EMAIL
  console.log('Authorize user based on this email address:', emailAddress)

  const authResponse = await np.sendAuth(emailAddress)
  console.log('Auth response:', authResponse)

  let code = await getCodeFromUser()
  while (code) {
    const validationResponse = await np.sendValidation(emailAddress, authResponse.token, code)
    console.log('Validation response:', validationResponse)
    code = await getCodeFromUser()
  }
}

main()

