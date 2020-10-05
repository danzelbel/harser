const core = require("@actions/core");
const fetch = require("node-fetch");

const baseUrl = "https://github.com";

async function harser() {
  const url = new URL(`${baseUrl}/danzelbel/harser`);
  const params = [];
  params["datetime"] = core.getInput("datetime");
  params["text"] = core.getInput("text");
  params["doublequotes"] = core.getInput("doublequotes");
  params["path"] = core.getInput("path");
  url.search = new URLSearchParams(params);
  const res = await fetch(url, { method: "GET" });
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