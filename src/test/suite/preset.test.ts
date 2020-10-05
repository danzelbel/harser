import * as vscode from "vscode";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs-extra";
import { RequestDocumentContentProvider, RequestsView } from "../../requestsView";
import { HbTemplate } from "../../handlebars";

const testdataDir = path.resolve(__dirname, "..", "..", "..", "testdata", "preset", "request-headers");
let templates = Object.values(HbTemplate);

/*********************************** DEBUG ***********************************/
// templates = [
// 	HbTemplate.RestSharp,
// 	HbTemplate.Fetch,
// 	HbTemplate.GithubActionsJS,
// 	HbTemplate.GithubActionsREADME,
// 	HbTemplate.GithubActionsYML
// ];
/*****************************************************************************/

let requestsView: RequestsView;

describe("Given an entry with request headers", () => {

	before(async () => {
		if (!requestsView) {
			requestsView = new RequestsView();
			await requestsView.init(undefined);
		}
		await vscode.window.showTextDocument(vscode.Uri.file(`${path.resolve(testdataDir, "log.har")}`));
	});

	for (const template of templates) {

		context(`And the user generates a ${template} file`, () => {

			for (let i = 1; i <= 3; i++) {

				context(`When the user applies request header preset ${i}`, () => {
					it("Then the code is generated", async () => {
						const item = requestsView.items![0];
						const docProvider = new RequestDocumentContentProvider();
						docProvider.requestHeaderPresetNum = i;
						const actual = docProvider.provideTextDocumentContent(item.resourceUri!.with({ path: `${item.id}/${item.label}.${template}` }));
						// console.log(actual);
						const expected = (await fs.readFile(path.resolve(testdataDir, `preset-${i}.${template}`))).toString();
						assert.strictEqual(actual, expected);
					});
				});
			}

		});
	}

	after(() => {
		requestsView.dispose();
	});
});