const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { promisify } = require('util');

const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = require('./config.json');

const jwksUri = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;

const jwks = jwksClient({
  jwksUri,
});

const jwtVerify = promisify(jwt.verify);

exports.handler = async (event) => {
  try {
    const token = event.headers.Authorization.split(' ')[1];

    const decoded = await jwtVerify(token, getKey, {
      audience: AUTH0_AUDIENCE,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
    });

    // If the token is valid, return the S3 object
    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello from S3!' }),
    };
    return response;
  } catch (error) {
    console.error(error);
    // If the token is invalid or there's an error, return an unauthorized response
    const response = {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
    return response;
  }
};

async function getKey(header, callback) {
  try {
    const key = await new Promise((resolve, reject) => {
      jwks.getSigningKey(header.kid, (err, key) => {
        if (err) reject(err);
        resolve(key.publicKey || key.rsaPublicKey);
      });
    });
    callback(null, key);
  } catch (error) {
    console.error(error);
    callback(error);
  }
}
