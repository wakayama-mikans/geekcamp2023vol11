require("dotenv").config();
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */

// Cloud Functions uses your function's url as the `targetAudience` value

// const targetAudience = process.env.GOOGLE_FUNCTIONS_URL;
const targetAudience = process.env.GOOGLE_FUNCTIONS_URL;
// For Cloud Functions, endpoint (`url`) and `targetAudience` should be equal
const url = targetAudience;

const { GoogleAuth } = require("google-auth-library");
const auth = new GoogleAuth();

async function getGoogleToken() {
  console.info(`request ${url} with target audience ${targetAudience}`);
  const client = await auth.getIdTokenClient(targetAudience);
  const res = await client.request({ url });
  console.info(res.data);

  // return res.data.token;
}

module.exports = { getGoogleToken };

console.info(targetAudience);

getGoogleToken();