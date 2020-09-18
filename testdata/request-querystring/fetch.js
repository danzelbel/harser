import fetch from "node-fetch";
import { URL, URLSearchParams } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const params = [];
    params["datetime"] = "11:59:59pm 12/31/9999";
    params["text"] = "Lorem ipsum dolor";
    params["doublequotes"] = "\"hello there";
    params["path"] = "c:\temp";
    url.search = new URLSearchParams(params);
    const res = await fetch(url, { method: "GET" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}