import * as vscode from "vscode";
import { RequestsView } from "./requestsView";
import { HbSetup } from "./handlebars";

export async function activate(ctx: vscode.ExtensionContext) {
	const hbSetup = new HbSetup();
	await hbSetup.init();
	ctx.subscriptions.push(hbSetup);
	ctx.subscriptions.push(new RequestsView());
}