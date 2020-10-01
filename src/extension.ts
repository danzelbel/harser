import * as vscode from "vscode";
import { RequestsView } from "./requestsView";

export async function activate(ctx: vscode.ExtensionContext) {
	const requestView = new RequestsView();
	ctx.subscriptions.push(requestView);
	await requestView.init(vscode.window.activeTextEditor);
}