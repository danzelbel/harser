import fetch from "node-fetch";
import { URL } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const b = {};
    b.boolean = true;
    b.number = 1;
    b.float_number = 1.1;
    b.datetime = "11:59:59pm 12/31/9999";
    b.text = "Lorem ipsum dolor";
    b.doublequotes = "\"hello there";
    b.path = "c:\temp";
    const body = JSON.stringify(b);
    const res = await fetch(url, { method: "POST", body: body });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
  }

  async test() {
    await harser();
  }
}