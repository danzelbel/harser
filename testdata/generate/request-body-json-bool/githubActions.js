const core = require("@actions/core");
const fetch = require("node-fetch");

const baseUrl = "https://github.com";

async function harser() {
  const url = new URL(`${baseUrl}/danzelbel/harser`);
  const body = core.getInput("body");
  const res = await fetch(url, { method: "POST", body: body });
  if (res.status !== 200) {
    throw new Error(await res.text());
  }
}

async function exec() {
  try {
    await harser();
  } catch (err) {
    core.setFailed(err.message);
  }
}

exec();