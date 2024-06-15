const fs = require("fs").promises;
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// require('dotenv').config();
// const credentials = process.env.CREDENTIALS_JSON;
// const token = process.env.TOKEN_JSON;

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
// const TOKEN_PATH = path.join(process.cwd(), "token.json");
// const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const SECRET_CREDENTIALS_NAME = 'projects/996547761326/secrets/credentials_json';
const SECRET_TOKEN_NAME = 'projects/996547761326/secrets/token_json';

const secretManagerClient = new SecretManagerServiceClient();

/**
 * Access secret version from Secret Manager.
 *
 * @param {string} name The name of the secret.
 * @return {Promise<string>} The secret payload.
 */
async function accessSecretVersion(name) {
  const [version] = await secretManagerClient.accessSecretVersion({
    name: name,
  });
  return version.payload.data.toString('utf8');
}

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await accessSecretVersion(SECRET_TOKEN_NAME);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await accessSecretVersion(SECRET_CREDENTIALS_NAME);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  // await fs.writeFile(TOKEN_PATH, payload);
  await accessSecretVersion(SECRET_TOKEN_NAME, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: await accessSecretVersion(SECRET_CREDENTIALS_NAME),
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

module.exports = { authorize };
