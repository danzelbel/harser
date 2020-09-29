import fetch from "node-fetch";
import { URL } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const b = [];
    b[0] = 1;
    b[1] = {};
    b[1]._null = null;
    b[1].boolean = true;
    b[1].float_number = 1.1;
    b[1].number = 1;
    b[1].long_number = 4294967296;
    b[1].text = "Lorem ipsum dolor";
    b[1].datetime = "11:59:59pm 12/31/9999";
    b[1].doublequotes = "\"hello there";
    b[1].path = "c:\\temp";
    b[2] = [];
    b[2][0] = 1;
    b[2][1] = {};
    b[2][1].number = 1;
    b[3] = {};
    b[3]._object = {};
    b[3]._object.number = 1;
    b[3]._object.array = [];
    b[3]._object.array[0] = 1;
    b[3]._object.array[1] = {};
    b[3]._object.array[1].number = 1;
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