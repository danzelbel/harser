import * as assert from 'assert';
import * as path from "path";
import * as fs from "fs-extra";
import { RequestsView } from '../../requestsView';
import { HbSetup, HbTemplate } from '../../handlebars';

let hbSetup: HbSetup;
const requestView = new RequestsView();
const testdataDir = path.resolve(__dirname, "..", "..", "..", "testdata");
let dirs = fs.readdirSync(testdataDir);
let templates = Object.values(HbTemplate);

/*********************************** DEBUG ***********************************/
dirs = dirs.filter(d => [
	"no-response-statustext",
	"request-body-formdata",
	"request-body-json-bool",
	"request-body-json-float",
	"request-body-json-number",
	"request-body-json-object",
	"request-body-json-string",
	"request-body-json-string-datetime",
	"request-body-json-string-doublequotes",
	"request-body-json-string-path",
	"request-headers",
	"request-querystring",
	"response-content-json-bool",
	"response-content-json-float",
	"response-content-json-number",
	"response-content-json-object",
	"response-content-json-string",
	"response-content-json-string-datetime",
	"response-content-json-string-doublequotes",
	"response-content-json-string-path",
].includes(d));

templates = [
	HbTemplate.RestSharp,
	HbTemplate.Fetch
];
/*****************************************************************************/

dirs.forEach(scenario => {

	describe(`Given an entry with ${scenario.replace(/-/g, " ")}`, () => {
		before(async () => {
			if (!hbSetup) {
				hbSetup = new HbSetup();
				await hbSetup.init();
			}
			const json = (await fs.readFile(path.resolve(testdataDir, scenario, "log.har"))).toString();
			requestView.readHar(json);
		});

		for (const template of templates) {

			context(`When the user generates a ${template} file`, () => {

				it("Then the code is generated", async () => {
					const actual = HbSetup.getOutput(template, requestView.items![0].entry);
					//console.log(actual);
					const expected = (await fs.readFile(path.resolve(testdataDir, scenario, template))).toString();
					assert.strictEqual(actual, expected);
				});
			});
		}

		after(() => {
			hbSetup.dispose();
			requestView.dispose();
		});
	});

});