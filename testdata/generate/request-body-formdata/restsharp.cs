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
        req.AddFile("uploadFile", "excellence.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        req.AddParameter("datetime", "11:59:59pm 12/31/9999", ParameterType.GetOrPost);
        req.AddParameter("text", "Lorem ipsum dolor", ParameterType.GetOrPost);
        req.AddParameter("doublequotes", "\"hello there", ParameterType.GetOrPost);
        req.AddParameter("path", "c:\\temp", ParameterType.GetOrPost);
        var res = await _restClient.ExecuteAsync(req);
        res.StatusCode.ShouldBe(HttpStatusCode.OK, res.Content);
    }

    public async Task Test()
    {
        await Harser();
    }
}