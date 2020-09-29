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
        dynamic body = new JArray(new int[4].Select(x => new JObject()));
        body[0] = 1;
        body[1]._null = null;
        body[1].boolean = true;
        body[1].float_number = 1.1;
        body[1].number = 1;
        body[1].long_number = 4294967296;
        body[1].text = "Lorem ipsum dolor";
        body[1].datetime = "11:59:59pm 12/31/9999";
        body[1].doublequotes = "\"hello there";
        body[1].path = "c:\\temp";
        body[2] = new JArray(new int[2].Select(x => new JObject()));
        body[2][0] = 1;
        body[2][1].number = 1;
        body[3]._object = new JObject();
        body[3]._object.number = 1;
        body[3]._object.array = new JArray(new int[2].Select(x => new JObject()));
        body[3]._object.array[0] = 1;
        body[3]._object.array[1].number = 1;
        req.AddParameter("application/json", JsonConvert.SerializeObject(body), ParameterType.RequestBody);
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
    }

    public async Task Test()
    {
        await Harser();
    }
}