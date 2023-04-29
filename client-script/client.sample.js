const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3000;

const AUTH0_DOMAIN = 'https://dev-lmxpjg0gz1s31pr2.us.auth0.com/authorize';
const AUTH0_AUDIENCE = 'https://ojmv9k56j6.execute-api.eu-north-1.amazonaws.com/s3bucket-stagetest';
const AUTH0_CLIENT_ID = 'zutxtADHJKkLoJfmkWVNZQCF0oeYjUmm';
const S3_BUCKET_NAME = 'testbucketauth0';
const API_GATEWAY_URL = 'https://ojmv9k56j6.execute-api.eu-north-1.amazonaws.com/s3bucket-stagetest';
const LAMBDA_FUNCTION_ARN = 'arn:aws:execute-api:eu-north-1:845650755658:ojmv9k56j6/*/GET/auth0bucket';
const CLIENT_EMAIL = 'oyewolebisola50@gmail.com';
const CLIENT_PASSWORD = 'oyewolebisola50@gmail.com';

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
