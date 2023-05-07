const { handler } = require("../../autotasks/relay/");
const { readFileSync } = require("fs");
require("dotenv").config();

// Run autotask code locally using the Relayer API key and secret
if (require.main === module) {
  const { RELAYER_API_KEY: apiKey, RELAYER_API_SECRET: apiSecret } = process.env;
  const payload = readFileSync("tmp/request.json");
  handler({ apiKey, apiSecret, request: { body: JSON.parse(payload) } })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
