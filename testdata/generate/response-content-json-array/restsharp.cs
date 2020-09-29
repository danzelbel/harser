using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using Shouldly;

public sealed class Foo
{
    private IRestClient _restClient = new RestClient("https://github.com") { CookieContainer = new CookieContainer() };

    public async Task<dynamic> Harser()
    {
        var req = new RestRequest("/danzelbel/harser", Method.GET);
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
        return JsonConvert.DeserializeObject(res.Content);
    }

    public async Task Test()
    {
        var data = await Harser();
        ((int)data[0]).ShouldBe(1);
        ((JProperty)data[1]._null).ShouldBe(null);
        ((bool)data[1].boolean).ShouldBe(true);
        ((double)data[1].float_number).ShouldBe(1.1);
        ((int)data[1].number).ShouldBe(1);
        ((long)data[1].long_number).ShouldBe(4294967296);
        ((string)data[1].text).ShouldBe("Lorem ipsum dolor");
        ((string)data[1].datetime).ShouldBe("11:59:59pm 12/31/9999");
        ((string)data[1].doublequotes).ShouldBe("\"hello there");
        ((string)data[1].path).ShouldBe("c:\\temp");
        ((IEnumerable<dynamic>)data[2]).Count().ShouldBe(2);
        ((int)data[2][0]).ShouldBe(1);
        ((int)data[2][1].number).ShouldBe(1);
        ((int)data[3]._object.number).ShouldBe(1);
        ((IEnumerable<dynamic>)data[3]._object.array).Count().ShouldBe(2);
        ((int)data[3]._object.array[0]).ShouldBe(1);
        ((int)data[3]._object.array[1].number).ShouldBe(1);
    }
}