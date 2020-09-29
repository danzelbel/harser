import fetch from "node-fetch";
import { URL } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const body = new FormData();
    body.append("uploadFile", fileInput.files[0], "excellence.xlsx");
    body.append("datetime", "11:59:59pm 12/31/9999");
    body.append("text", "Lorem ipsum dolor");
    body.append("doublequotes", "\"hello there");
    body.append("path", "c:\\temp");
    const res = await fetch(url, { method: "POST", body: body });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}