const { handler } = require("../../autotasks/relay/");
const { readFileSync } = require("fs");
require("dotenv").config();

// Run autotask code locally using the Relayer API key and secret
if (require.main === module) {
  const { RELAYER_API_KEY: apiKey, RELAYER_API_SECRET: apiSecret } = process.env;
  const payload = readFileSync("tmp/request.json");
  handler({ apiKey, apiSecret, request: { body: JSON.parse(payload) } })
    .then(async ({ tx }) => {
      console.log("Waiting for 1 block confirmation...");
      const txRes = await tx.wait(1);
      console.log(txRes);
      console.log("Confirmed!");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
