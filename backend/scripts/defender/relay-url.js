require("dotenv").config();
const axios = require("axios");

async function main() {
  const url = process.env.AUTOTASK_URL;

  const response = await axios.post(url, require("fs").readFileSync("tmp/request.json"));

  console.log(response.data.result.wait);
}

main()
  .then(() => console.log("Done!"))
  .catch((err) => console.log(err));
