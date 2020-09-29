import * as vscode from "vscode";
import * as Handlebars from "handlebars";
import { Param, Entry } from "har-format";
import { debounce } from "debounce";
import * as fs from "fs-extra";
import * as path from "path";
import { flatten, flattenCsharpBody } from "./flatten";

export enum HbTemplate {
	RestSharp = "restsharp.cs",
	Fetch = "fetch.js"
}

export class HbSetup implements vscode.Disposable {
	private _disposables: vscode.Disposable[] = [];
	private static _templates: { [key: string]: HandlebarsTemplateDelegate<any> } = {};
	private _debouncedSetTemplates = debounce(this.setTemplates, 1000);

	async init() {
		await this.setConfig();
		this.setTemplates();
		this.registerHelpers();
		this._disposables.push(vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration("harser.template")) {
				this._debouncedSetTemplates();
			}
		}));
	}

	static getOutput(template: string, entry: Entry) {
		return this._templates[template](entry);
	}

	private async setConfig() {
		const cfg = vscode.workspace.getConfiguration("harser.template");
		for (const template of Object.values(HbTemplate)) {
			if (!cfg.get(template)) {
				const value = (await fs.readFile(path.join(__dirname, "..", `templates/${template}.handlebars`))).toString();
				await cfg.update(template, value, vscode.ConfigurationTarget.Global);
			}
		}
	}

	private setTemplates() {
		for (const template of Object.values(HbTemplate)) {
			const input = vscode.workspace.getConfiguration("harser.template").get(template);
			HbSetup._templates[template] = Handlebars.compile(input);
		}
	}

	private registerHelpers() {
		Handlebars.registerHelper("get-baseurl", (url: string) => {
			const uri = vscode.Uri.parse(url);
			return `${uri.scheme}://${uri.authority}`;
		});
		Handlebars.registerHelper("get-path", (url: string) => {
			return vscode.Uri.parse(url).path;
		});
		Handlebars.registerHelper("get-action", (url: string) => {
			const uri = vscode.Uri.parse(url);
			let action = uri.path.substring(uri.path.lastIndexOf("/") + 1, uri.path.length);
			// TODO REPLACE INVALID CHARACTERS
			return action;
		});
		Handlebars.registerHelper("parse-json", (text: string) => {
			return JSON.parse(text);
		});
		Handlebars.registerHelper("flatten-csharp-body", (path: string, value: any) => {
			const flattened = flattenCsharpBody(value, path);
			return flattened;
		});
		Handlebars.registerHelper("flatten", (path: string, value: any) => {
			const flattened = flatten(value, path);
			return flattened;
		});
		Handlebars.registerHelper("get-length", (value: Array<any>) => {
			return value.length;
		});
		Handlebars.registerHelper("is-array", (value: any) => {
			return Array.isArray(value);
		});
		Handlebars.registerHelper("is-null", (value: any) => {
			return value === null;
		});
		Handlebars.registerHelper("equal", (left: any, right: any) => {
			return left === right;
		});
		Handlebars.registerHelper("contains", (left: string, right: string) => {
			return left.includes(right);
		});
		Handlebars.registerHelper("upper-first", (value: string) => {
			return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
		});
		Handlebars.registerHelper("lower-first", (value: string) => {
			return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
		});
		Handlebars.registerHelper("typeof", (value: any, type: string) => {
			return typeof (value) === type;
		});
		Handlebars.registerHelper("get-postdata-filename", (entry: Entry, param: Param) => {
			const line = entry.request.postData?.text.split("------").find(p => p.includes(param.name))?.split("\n").find(p => p.includes(param.name));
			const filename = line?.substring(line.indexOf("filename=\"") + 10, line.length - 2);
			return filename;
		});
		Handlebars.registerHelper("get-postdata-contenttype", (entry: Entry, param: Param) => {
			const line = entry.request.postData?.text.split("------").find(p => p.includes(param.name))?.split("\n").find(p => p.includes("Content-Type"));
			const type = line?.substring(line.indexOf("Content-Type: ") + 14, line.length).trim();
			return type;
		});
		Handlebars.registerHelper("csharp-escape-string", (value: string) => {
			value = JSON.stringify(value);
			return value;
		});
		Handlebars.registerHelper("js-escape-string", (value: string) => {
			return JSON.stringify(value);
		});
		Handlebars.registerHelper("csharp-type", (value: any) => {
			switch (typeof value) {
				case "string":
					return "string";
				case "number":
					return value.toString().includes(".")
						? "double"
						: value > 4294967295
							? "long"
							: "int";
				case "bigint":
					return "long";
				case "boolean":
					return "bool";
				case "undefined":
				default:
					return "JProperty";
			}
		});
	}

	dispose() {
		this._disposables.forEach(d => d.dispose());
	}
}