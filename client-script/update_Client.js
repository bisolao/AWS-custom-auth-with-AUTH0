// Import necessary packages and modules
const express = require('express'); // Import the express library
const axios = require('axios'); // Import the axios library
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

// Set the required environment variables
const CLIENT_ID = '<your_client_id>'; // Set your Auth0 Client ID
const CLIENT_SECRET = '<your_client_secret>'; // Set your Auth0 Client Secret
const DOMAIN = '<your_auth0_domain>'; // Set your Auth0 Domain
const API_URL = '<your_api_gateway_invoke_url>'; // Set the URL for your API Gateway
const S3_BUCKET_NAME = '<your_s3_bucket_name>'; // Set your S3 Bucket Name

// Create an instance of the Express application
const app = express(); 

// Set the port that the server will listen on
const port = 3000;

// Create a route for a protected resource that requires authentication
app.get('/protected-resource', async (req, res) => {
  try {
    // Call the getToken function to retrieve an access token
    const token = await getToken();
    // Call the getResource function with the access token to get the protected resource
    const resource = await getResource(token);
    // Send the protected resource data in the response
    res.send(resource.data);
  } catch (error) {
    // If there is an error, send a 401 Unauthorized status code with the error message
    res.status(401).send(error.message);
  }
});

// Define the getToken function to retrieve an access token from Auth0
async function getToken() {
  // Make a POST request to the Auth0 API to retrieve an access token
  const response = await axios.post(`https://${DOMAIN}/oauth/token`, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials',
    audience: API_URL,
  });
  // Return the access token from the response data
  return response.data.access_token;
}

// Define the getResource function to retrieve a protected resource from the API Gateway
async function getResource(token) {
  // Set the Authorization header with the access token
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  // Make a GET request to the API Gateway to retrieve the protected resource
  const response = await axios.get(`https://${API_URL}/protected-resource`, {
    headers,
  });
  // Return the response
  return response;
}

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Client app listening at http://localhost:${port}`);
});
