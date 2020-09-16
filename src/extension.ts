import * as vscode from "vscode";
import { RequestsView } from "./requestsView";
import { HbSetup } from "./handlebars";

export function activate(ctx: vscode.ExtensionContext) {
	ctx.subscriptions.push(new RequestsView());
	ctx.subscriptions.push(new HbSetup());
}