const core = require("@actions/core");
const fetch = require("node-fetch");

const baseUrl = "https://github.com";

async function harser() {
  const url = new URL(`${baseUrl}/danzelbel/harser`);
  const headers = new Headers();
  headers.append("datetime", core.getInput("datetime"));
  const res = await fetch(url, { method: "GET", headers: headers });
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