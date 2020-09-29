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
        var req = new RestRequest("/danzelbel/harser", Method.POST);
        dynamic body = new JObject();
        body._null = null;
        body.boolean = true;
        body.float_number = 1.1;
        body.number = 1;
        body.long_number = 4294967296;
        body.text = "Lorem ipsum dolor";
        body.datetime = "11:59:59pm 12/31/9999";
        body.doublequotes = "\"hello there";
        body.path = "c:\\temp";
        body._object = new JObject();
        body._object.number = 1;
        body._object.array = new JArray(new int[2].Select(x => new JObject()));
        body._object.array[0] = 1;
        body._object.array[1].number = 1;
        req.AddParameter("application/json", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
    }

    public async Task Test()
    {
        await Harser();
    }
}