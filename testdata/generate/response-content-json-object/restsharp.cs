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
        var req = new RestRequest("/danzelbel/harser", Method.POST);
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
        return JsonConvert.DeserializeObject(res.Content);
    }

    public async Task Test()
    {
        var data = await Harser();
        ((JProperty)data._null).ShouldBe(null);
        ((bool)data.boolean).ShouldBe(true);
        ((double)data.float_number).ShouldBe(1.1);
        ((int)data.number).ShouldBe(1);
        ((long)data.long_number).ShouldBe(4294967296);
        ((string)data.text).ShouldBe("Lorem ipsum dolor");
        ((string)data.datetime).ShouldBe("11:59:59pm 12/31/9999");
        ((string)data.doublequotes).ShouldBe("\"hello there");
        ((string)data.path).ShouldBe("c:\\temp");
        ((int)data._object.number).ShouldBe(1);
        ((IEnumerable<dynamic>)data._object.array).Count().ShouldBe(2);
        ((int)data._object.array[0]).ShouldBe(1);
        ((int)data._object.array[1].number).ShouldBe(1);
    }
}