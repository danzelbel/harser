import * as vscode from "vscode";
import { Entry, Har } from "har-format";
import { debounce } from "debounce";
import * as path from "path";
import { HbTemplate, HbSetup } from "./handlebars";

export interface EntryExt extends Entry {
	_resourceType: string;
}

export class RequestItem extends vscode.TreeItem {
	contextValue = "request";

	constructor(id: number, public entry: EntryExt) {
		super("");
		this.id = `${id}`;
		const url = entry.request.url.endsWith("/") ? entry.request.url.substring(0, entry.request.url.length - 1) : entry.request.url;
		this.label = url.substring(url.lastIndexOf("/") + 1, url.length);
		this.description = entry._resourceType;
		this.tooltip = entry.request.url;

		let ext = "";
		switch (entry._resourceType) {
			case "stylesheet":
			case "script":
			case "image":
			case "other":
				ext = path.extname(this.label);
				break;
			case "xhr":
				ext = ".json";
				break;
			default:
				ext = "";
				break;
		}

		this.resourceUri = vscode.Uri.parse(`harser:/${this.id}${ext}`);
	}
}

export let items: Map<number, RequestItem> | undefined;

class RequestsDataProvider implements vscode.TreeDataProvider<RequestItem>, vscode.Disposable {
	private _onDidChangeTreeData = new vscode.EventEmitter<RequestItem | undefined>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	getTreeItem(element: RequestItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: RequestItem): RequestItem[] | undefined {
		if (!element) {
			return items ? [...items.values()] : undefined;
		}
		return;
	}

	refresh() {
		this._onDidChangeTreeData.fire(undefined);
	}

	dispose() {
		this._onDidChangeTreeData.dispose();
	}
}

class RequestDocumentContentProvider implements vscode.TextDocumentContentProvider, vscode.Disposable {
	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
	readonly onDidChange = this._onDidChange.event;

	provideTextDocumentContent(uri: vscode.Uri): vscode.ProviderResult<string> {
		const template = uri.path.substring(uri.path.indexOf(".") + 1, uri.path.length);
		const idx = parseInt(path.dirname(uri.path));
		const entry = items!.get(idx)!.entry;
		return HbSetup.getOutput(template, entry);
	}

	update(uri: vscode.Uri) {
		this._onDidChange.fire(uri);
	}

	dispose() {
		this._onDidChange.dispose();
	}
}

export class RequestsView implements vscode.Disposable {
	private _disposables: vscode.Disposable[] = [];
	private _treeData: RequestsDataProvider = new RequestsDataProvider();
	private _view: vscode.TreeView<RequestItem>;
	private _docProvider = new RequestDocumentContentProvider();
	private _debouncedRefresh = debounce(this.refresh, 250);
	private _docs: Map<string, boolean> = new Map<string, boolean>();
	private _entries: Entry[] = [];
	private _resourceType: string = "all";

	constructor() {
		this._view = vscode.window.createTreeView("harser.requestsView", { treeDataProvider: this._treeData });
		this._disposables.push(this._view);
		this._disposables.push(vscode.workspace.registerTextDocumentContentProvider("harser", this._docProvider));
		this._disposables.push(vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration("harser.template")) {
				this._docs.forEach((v, k, m) => m.set(k, true));
			}
		}));
		this._disposables.push(vscode.window.onDidChangeActiveTextEditor(e => {
			if (e && e.document.languageId === "json") {
				this.readHar(e.document.getText());
			} else {
				items = undefined;
			}
		}, this));
		this._disposables.push(vscode.commands.registerCommand("harser.requestsView.all", () => this.filter("all"), this));
		this._disposables.push(vscode.commands.registerCommand("harser.requestsView.xhr", () => this.filter("xhr"), this));

		for (const template of Object.values(HbTemplate)) {
			this._disposables.push(vscode.commands.registerCommand(`harser.requestsView.${template}`, e => this.showTextDocument(e, template), this));
		}

		this._disposables.push(vscode.workspace.onDidChangeTextDocument(e => {
			if (!e || e?.document.languageId === "json") {
				this._debouncedRefresh();
			}
		}));
	}

	get items() {
		return items ? [...items!.values()] : undefined;
	}

	readHar(json: string) {
		items = new Map();
		try {
			// TODO: FIND A WAY TO VALIDATE JSON WITH HAR SCHEMA
			const har: Har = JSON.parse(json);
			this._entries = har.log.entries;
			this.setItems();
		} catch (e) {
			// DO NOTHING
		}
		this.refresh();
		this._docs.forEach((v, k, m) => m.set(k, true));
	}

	refresh(): void {
		this._treeData.refresh();
	}

	filter(resourceType: string) {
		this._resourceType = resourceType;
		this.setItems();
		this.refresh();
	}

	setItems() {
		this._entries = this._resourceType !== "all"
			? this._entries.filter((e: any) => e._resourceType === this._resourceType)
			: this._entries;
		this._entries.forEach((e, i) => {
			items!.set(i, new RequestItem(i, e as EntryExt));
		});
	}

	async showTextDocument(element: RequestItem, template: HbTemplate): Promise<void> {
		const uri = element.resourceUri!.with({ path: `${element.id}/${element.label}.${template}` });
		if (!this._docs.has(uri.path)) {
			this._docs.set(uri.path, false);
		} else if (this._docs.get(uri.path)) {
			this._docProvider.update(uri);
			this._docs.set(uri.path, false);
		}
		await vscode.window.showTextDocument(uri, { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true });
	}

	dispose(): void {
		this._disposables.forEach(d => d.dispose());
	}
}