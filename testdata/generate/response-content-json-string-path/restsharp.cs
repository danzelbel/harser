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
        ((string)data).ShouldBe("c:\\temp");
    }
}