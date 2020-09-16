using System.Net;
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
        ((bool)data.boolean).ShouldBe(true);
        ((int)data.number).ShouldBe(1);
        ((long)data.long_number).ShouldBe(4294967296);
        ((float)data.float_number).ShouldBe(1.1);
        ((string)data.datetime).ShouldBe("11:59:59pm 12/31/9999");
        ((string)data.text).ShouldBe("Lorem ipsum dolor");
        ((string)data.doublequotes).ShouldBe("\"hello there");
        ((string)data.path).ShouldBe(@"c:\temp");
    }
}