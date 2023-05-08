// creates the autotask in the defender
const { AutotaskClient } = require("defender-autotask-client");
const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
require("dotenv").config();

async function main() {
  const { TEAM_API_KEY, TEAM_API_SECRET } = process.env;
  const client = new AutotaskClient({ apiKey: TEAM_API_KEY, apiSecret: TEAM_API_SECRET });
  const encodedZippedCode = await client.getEncodedZippedCodeFromFolder("./build/relay");
  const {
    relayer: { relayerId },
  } = JSON.parse(readFileSync(path.join(__dirname, "relay.json")));

  const autotask = await client.create({
    name: "EHR-Relay",
    encodedZippedCode,
    relayerId,
    trigger: {
      type: "webhook",
    },
    paused: false,
  });

  writeFileSync(path.join(__dirname, "autotask.json"), autotask);
  console.log(`Autotask ID: ${autotask.autotaskId}`);
}

main()
  .then(() => console.log("Done!"))
  .catch((err) => console.log(err));
