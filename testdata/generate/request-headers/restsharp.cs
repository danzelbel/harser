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

    public async Task Harser()
    {
        var req = new RestRequest("/danzelbel/harser", Method.GET);
        req.AddHeader("datetime", "11:59:59pm 12/31/9999");
        req.AddHeader("text", "Lorem ipsum dolor");
        req.AddHeader("doublequotes", "\"hello there");
        req.AddHeader("path", "c:\\temp");
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
    }

    public async Task Test()
    {
        await Harser();
    }
}