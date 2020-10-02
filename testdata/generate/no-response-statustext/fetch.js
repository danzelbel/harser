import fetch from "node-fetch";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const res = await fetch(url, { method: "GET" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}