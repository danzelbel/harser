import fetch from "node-fetch";
import { URL } from "url";
import "chai/register-should";

class Foo {
  baseUrl = "https://github.com";

  async harser() {
    const url = new URL(`${baseUrl}/danzelbel/harser`);
    const res = await fetch(url, { method: "POST" });
    if (res.status !== 200) {
      throw new Error(await res.text());
    }
    return await res.json();
  }

  async test() {
    const data = await harser();
    data._null.should.equal(null);
    data.boolean.should.equal(true);
    data.float_number.should.equal(1.1);
    data.number.should.equal(1);
    data.long_number.should.equal(4294967296);
    data.text.should.equal("Lorem ipsum dolor");
    data.datetime.should.equal("11:59:59pm 12/31/9999");
    data.doublequotes.should.equal("\"hello there");
    data.path.should.equal("c:\\temp");
    data._object.number.should.equal(1);
    data._object.array.length.should.equal(2);
    data._object.array[0].should.equal(1);
    data._object.array[1].number.should.equal(1);
  }
}