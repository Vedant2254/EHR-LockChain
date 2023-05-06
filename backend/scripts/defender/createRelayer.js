const { RelayClient } = require("defender-relay-client");
const { writeFile } = require("fs/promises");
const path = require("path");
require("dotenv").config();

async function main() {
  const { TEAM_API_KEY, TEAM_API_SECRET } = process.env;
  const relayClient = new RelayClient({ apiKey: TEAM_API_KEY, apiSecret: TEAM_API_SECRET });
  const relayer = await relayClient.create({
    name: "EHR-Payer",
    network: "mumbai",
    minBalance: BigInt(1e17).toString(),
  });

  await writeFile(
    path.join(__dirname, "relayer.json"),
    JSON.stringify({
      relayer,
    })
  );

  console.log(relayer);
}

main()
  .then(() => console.log("Done!"))
  .catch((err) => console.log(err));
