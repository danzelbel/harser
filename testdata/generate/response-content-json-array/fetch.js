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
    return await res.json();
  }

  async test() {
    const data = await harser();
    data[0].should.equal(1);
    data[1]._null.should.equal(null);
    data[1].boolean.should.equal(true);
    data[1].float_number.should.equal(1.1);
    data[1].number.should.equal(1);
    data[1].long_number.should.equal(4294967296);
    data[1].text.should.equal("Lorem ipsum dolor");
    data[1].datetime.should.equal("11:59:59pm 12/31/9999");
    data[1].doublequotes.should.equal("\"hello there");
    data[1].path.should.equal("c:\\temp");
    data[2].length.should.equal(2);
    data[2][0].should.equal(1);
    data[2][1].number.should.equal(1);
    data[3]._object.number.should.equal(1);
    data[3]._object.array.length.should.equal(2);
    data[3]._object.array[0].should.equal(1);
    data[3]._object.array[1].number.should.equal(1);
  }
}