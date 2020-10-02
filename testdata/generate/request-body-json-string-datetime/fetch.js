import fetch from "node-fetch";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const body = "11:59:59pm 12/31/9999";
    const res = await fetch(url, { method: "POST", body: body });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}