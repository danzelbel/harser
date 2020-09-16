using System.Net;
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
        var req = new RestRequest("/danzelbel/harser", Method.POST);
        dynamic body = new JObject();
        body.boolean = true;
        body.number = 1;
        body.float_number = 1.1;
        body.datetime = "11:59:59pm 12/31/9999";
        body.text = "Lorem ipsum dolor";
        body.doublequotes = "\"hello there";
        body.path = @"c:\temp";
        req.AddParameter("application/json", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
    }

    public async Task Test()
    {
        await Harser();
    }
}