const core = require("@actions/core");
const fetch = require("node-fetch");

const baseUrl = "https://github.com";

async function harser() {
  const url = new URL(`${baseUrl}/danzelbel/harser`);
  const body = new FormData();
  body.append("uploadFile", fileInput.files[0], core.getInput("uploadFile"));
  body.append("datetime", core.getInput("datetime"));
  body.append("text", core.getInput("text"));
  body.append("doublequotes", core.getInput("doublequotes"));
  body.append("path", core.getInput("path"));
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