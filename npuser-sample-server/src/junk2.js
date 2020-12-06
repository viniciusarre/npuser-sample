
const { MY_APP_TOKEN_SECRET, NPUSER_CLIENT_ID, NPUSER_CLIENT_SECRET, NPUSER_URL } = process.env

const config = {
  MY_APP_TOKEN_SECRET: MY_APP_TOKEN_SECRET,
  NPUSER_CLIENT_ID: NPUSER_CLIENT_ID,
  NPUSER_CLIENT_SECRET: NPUSER_CLIENT_SECRET,
  NPUSER_URL: NPUSER_URL
};

export default config
/*
MY_APP_TOKEN_SECRET: 'supersecret',
  NPUSER_CLIENT_ID: 'client1',
  NPUSER_CLIENT_SECRET: 'secret1',
  NPUSER_URL: 'https://npuser.org'
*/