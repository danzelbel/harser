import fetch from "node-fetch";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const b = {};
    b._null = null;
    b.boolean = true;
    b.float_number = 1.1;
    b.number = 1;
    b.long_number = 4294967296;
    b.text = "Lorem ipsum dolor";
    b.datetime = "11:59:59pm 12/31/9999";
    b.doublequotes = "\"hello there";
    b.path = "c:\\temp";
    b._object = {};
    b._object.number = 1;
    b._object.array = [];
    b._object.array[0] = 1;
    b._object.array[1] = {};
    b._object.array[1].number = 1;
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