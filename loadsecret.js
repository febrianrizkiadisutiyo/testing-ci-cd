const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function accessSecretVersion(secretName) {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  });
  const payload = version.payload.data.toString('utf8');
  return payload;
}

module.exports = { accessSecretVersion };
