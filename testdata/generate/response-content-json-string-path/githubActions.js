const core = require("@actions/core");
const fetch = require("node-fetch");

const baseUrl = "https://github.com";

async function harser() {
  const url = new URL(`${baseUrl}/danzelbel/harser`);
  const res = await fetch(url, { method: "GET" });
  if (res.status !== 200) {
    throw new Error(await res.text());
  }
  return await res.json();
}

async function exec() {
  try {
    const data = await harser();
    core.setOutput("data", data);
  } catch (err) {
    core.setFailed(err.message);
  }
}

exec();