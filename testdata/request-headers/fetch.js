import fetch from "node-fetch";
import { URL } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const headers = new Headers();
    headers.append("datetime", "11:59:59pm 12/31/9999");
    headers.append("text", "Lorem ipsum dolor");
    headers.append("doublequotes", "\"hello there");
    headers.append("path", "c:\temp");
    const res = await fetch(url, { method: "GET", headers: headers });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}