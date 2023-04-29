const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3000;
const AUTH0_DOMAIN = 'your-auth0-domain';
const AUTH0_AUDIENCE = 'your-auth0-audience';
const AUTH0_CLIENT_ID = 'your-auth0-client-id';
const S3_BUCKET_NAME = 'your-s3-bucket-name';
const API_GATEWAY_URL = 'your-api-gateway-url';
const LAMBDA_FUNCTION_ARN = 'your-lambda-function-arn';
const CLIENT_EMAIL = 'client-email';
const CLIENT_PASSWORD = 'client-password';

app.get('/', async (req, res) => {
  try {
    // Authenticate with Auth0
    const { data: { access_token } } = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'password',
      username: CLIENT_EMAIL,
      password: CLIENT_PASSWORD,
      audience: AUTH0_AUDIENCE,
      client_id: AUTH0_CLIENT_ID
    });

    // Verify the token with the Lambda function
    const { data: { isAuthorized } } = await axios.post(API_GATEWAY_URL, {
      token: access_token,
      bucketName: S3_BUCKET_NAME,
      lambdaFunctionArn: LAMBDA_FUNCTION_ARN
    });

    // If authorized, download the file from S3
    if (isAuthorized) {
      const { data } = await axios.get(`https://${S3_BUCKET_NAME}.s3.amazonaws.com/my-resource.txt`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      res.send(data);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
