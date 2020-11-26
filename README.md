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


## How I created the sample client

```
npm install @vue/cli --save-dev
npm install @vue/cli-init --save-dev
node node_modules/@vue/cli/bin/vue.js init webpack npuser-client
```

Tested the created project with ```npm start``` which runs the local web server on ```http://localhost:8080```.
And with ```npm run build``` which builds the static project.  Unfortunately the build also generates
tens of warnings about circular dependencies.  Will need to see if these stay around and how to fix them.

For this project I also want pug, sass and the npuser icon.
```
npm install -D sass-loader node-sass
```

```
Vue CLI v4.5.9
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◉ Choose Vue version
 ◉ Babel
 ◉ TypeScript
 ◉ Progressive Web App (PWA) Support
❯◉ Router
 ◉ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◉ Unit Testing
 ◉ E2E Testing


Vue CLI v4.5.9
? Please pick a preset: Manually select features
? Check the features needed for your project: Choose Vue version, Babel, TS, PWA, Router, Vuex, CSS Pre-processors, Linter, Unit, E2E
? Choose a version of Vue.js that you want to start the project with 3.x (Preview)
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with node-sass)
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Pick a unit testing solution: Jest
? Pick an E2E testing solution: Cypress
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N)




```

```
## get the npuser icon...
cd npuser-sample-client/public
cp ../../../npuser/client/public/favicon.ico .

## remove all the Vue icon files
cd img/icons
rm *
```

```
npm run serve -- --port 8081
```
