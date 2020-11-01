# npuer-sample
A sample that uses the no password user authentication (npuser) services

# Sample npuser client

This sample NodeJS project demonstrates how a npusr client sends the initial
authorization request to the npuser server. It then prompts the user, on the command line,
to enter the verification code.  Get and enter the code. The sample app then sends the verification
request which validates the user.

## Configuration

Copy the sample environment files into your local (not in git).
```
cp sample.dev.env .env.dev
cp sample.prod.env .env.prod
```

The DEV sample should work as is with the defaults used by a locally running npuser authorization service.

The PROD sample needs real client id and secret and email address.

Adjust the .env files to suit your needs and run the sample ...

## Build
Need to build to convert Typescript to JS
```
npm run build:run
```

## Run
```
# dev
npm run run

#prod
npm run run:prod
```

## How to obtain the verification code

This sample application sends the authorization request.  You then need to find the
verification code the npuser authorization server creaetd.

If you are running this as a developer of npuser then you can see the npuser server's
console output. The verification code is there.

If you are running this as a developer of an application that will use the npuser server
then configure this sample to reach out to a running service. You will then need to
modify the sample code to use a real email address that you can access. The verification
code will appear in your inbox.


## How was this project created?

```
# initialize the project
npm init -y

# install webbpack
npm install webpack webpack-cli --save-dev
npm install nodemon-webpack-plugin --save-dev
touch webpack.config.js

# application dependencies
npm install dotenv --save
npm install npuser-client --save
npm install readline --save

```

Add a webpage.config.js file (set target as node)
```
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding
const path = require('path')
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'main.js',
  },
  plugins: [
    new NodemonPlugin(), // Dong
  ],
  target: 'node'
};
```

Adjust the scripts in the package.json file.
```
  "scripts": {
    "watch": "webpack --watch --mode=development",
    "build": "webpack --mode=development && npm run run",
    "run": "node dist/main.js"
  },
```
