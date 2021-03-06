import fetch from "node-fetch";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const headers = new Headers();
    headers.append("datetime", "11:59:59pm 12/31/9999");
    headers.append("text", "Lorem ipsum dolor");
    const res = await fetch(url, { method: "GET", headers: headers });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}