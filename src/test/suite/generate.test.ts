import * as vscode from "vscode";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs-extra";
import { RequestDocumentContentProvider, RequestsView } from "../../requestsView";
import { HbTemplate } from "../../handlebars";

const testdataDir = path.resolve(__dirname, "..", "..", "..", "testdata", "generate");
let dirs = fs.readdirSync(testdataDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
let templates = Object.values(HbTemplate);

/*********************************** DEBUG ***********************************/
// dirs = dirs.filter(d => [
// 	"no-response-statustext",
// 	"request-body-formdata",
// 	"request-body-json-array",
// 	"request-body-json-bool",
// 	"request-body-json-float",
// 	"request-body-json-null",
// 	"request-body-json-number",
// 	"request-body-json-object",
// 	"request-body-json-string",
// 	"request-body-json-string-datetime",
// 	"request-body-json-string-doublequotes",
// 	"request-body-json-string-path",
// 	"request-headers",
// 	"request-querystring",
// 	"response-content-json-array",
// 	"response-content-json-bool",
// 	"response-content-json-float",
// 	"response-content-json-null",
// 	"response-content-json-number",
// 	"response-content-json-object",
// 	"response-content-json-string",
// 	"response-content-json-string-datetime",
// 	"response-content-json-string-doublequotes",
// 	"response-content-json-string-path",
// ].includes(d));

// templates = [
// 	HbTemplate.RestSharp,
// 	HbTemplate.Fetch,
// 	HbTemplate.GithubActionsJS,
// 	HbTemplate.GithubActionsREADME,
// 	HbTemplate.GithubActionsYML
// ];
/*****************************************************************************/

let requestsView: RequestsView;
const scenario = dirs[0];

describe(`Given an entry with ${scenario.replace(/-/g, " ")}`, () => {

	before(async () => {
		if (!requestsView) {
			requestsView = new RequestsView();
			await requestsView.init(undefined);
		}
		await vscode.window.showTextDocument(vscode.Uri.file(`${path.resolve(testdataDir, scenario, "log.har")}`));
	});

	for (const template of templates) {

		context(`When the user generates a ${template} file`, () => {
			it("Then the code is generated", async () => {
				const item = requestsView.items![0];
				await vscode.commands.executeCommand(`harser.requestsView.${template}`, item);
				let doc = await vscode.workspace.openTextDocument(item.resourceUri!.with({ path: `${item.id}/${item.label}.${template}` }));
				const actual = doc.getText();
				// console.log(actual);
				const expected = (await fs.readFile(path.resolve(testdataDir, scenario, template))).toString();
				assert.strictEqual(actual, expected);
			});
		});
	}

	after(() => {
		requestsView.dispose();
	});
});

dirs.slice(1).forEach(scenario => {

	describe(`Given an entry with ${scenario.replace(/-/g, " ")}`, () => {
		before(async () => {
			if (!requestsView) {
				requestsView = new RequestsView();
				await requestsView.init(undefined);
			}
			const json = (await fs.readFile(path.resolve(testdataDir, scenario, "log.har"))).toString();
			requestsView.readHar(json);
		});

		for (const template of templates) {

			context(`When the user generates a ${template} file`, () => {
				it("Then the code is generated", async () => {
					const item = requestsView.items![0];
					const docProvider = new RequestDocumentContentProvider();
					const actual = docProvider.provideTextDocumentContent(item.resourceUri!.with({ path: `${item.id}/${item.label}.${template}` }));
					// console.log(actual);
					const expected = (await fs.readFile(path.resolve(testdataDir, scenario, template))).toString();
					assert.strictEqual(actual, expected);
				});
			});
		}

		after(() => {
			requestsView.dispose();
		});
	});

});