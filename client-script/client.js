const axios = require('axios');

// Your Auth0 domain
const AUTH0_DOMAIN = 'https://dev-lmxpjg0gz1s31pr2.us.auth0.com';

// Your API Gateway URL
const API_GATEWAY_URL = 'https://fu5pyc9kee.execute-api.eu-north-1.amazonaws.com/s3bucket-apistagetest';

// Your S3 resource key
const S3_RESOURCE_KEY = 'bucket_test.json';

async function getToken() {
  try {
    const response = await axios.post(`${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'client_credentials',
      username: 'oyewolebisola50@gmail.com',
      password: 'oyewolebisola50@gmail.com',
      audience: API_GATEWAY_URL,
      scope: 'openid profile email',
      client_id: 'w6zH3l6LBPBVDD3r2vMX7DYAsCXLAGMi',
      client_secret: 'y605aOU_NZJPtsww3yYu27J-VWusRg3FIBKtbFFQ6oX6x3DXofonHz9NwuTskLEw',
    });
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
}

async function getS3Resource(token) {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/${S3_RESOURCE_KEY}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer',
    });
    console.log(`Retrieved S3 resource with status code ${response.status}`);
    // TODO: Handle the retrieved resource as needed
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const token = await getToken();
  await getS3Resource(token);
}

main();
