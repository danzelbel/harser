import fetch from "node-fetch";
import { URL } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const res = await fetch(url, { method: "GET" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
    return await res.json();
  }

  async test() {
    const data = await harser();
    data.should.equal("11:59:59pm 12/31/9999");
  }
}