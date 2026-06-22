/**
 * Mock for the VS Code extension API.
 * Only the APIs used by directix vscode-extension are mocked.
 */
export const languages = {
	createDiagnosticCollection: () => ({
		set: () => {},
		delete: () => {},
		dispose: () => {},
	}),
}

export const window = {
	createOutputChannel: () => ({
		appendLine: () => {},
		clear: () => {},
		show: () => {},
		dispose: () => {},
	}),
	createWebviewPanel: () => ({
		webview: {
			html: '',
			onDidReceiveMessage: () => {},
			postMessage: () => {},
		},
		reveal: () => {},
		onDidDispose: () => {},
		dispose: () => {},
	}),
	showInformationMessage: () => {},
	showWarningMessage: () => {},
}

export const workspace = {
	onDidChangeTextDocument: () => () => {},
	onDidOpenTextDocument: () => () => {},
	textDocuments: [],
	workspaceFolders: undefined,
}

export const commands = {
	registerCommand: () => () => {},
}

export class Disposable {
	dispose() {}
}

export class Diagnostic {
	range: any
	message: string
	severity: any
	constructor(range: any, message: string, severity?: any) {
		this.range = range
		this.message = message
		this.severity = severity
	}
}

export const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 }

export class Range {
	start: any
	end: any
	constructor(start: any, end: any) {
		this.start = start
		this.end = end
	}
}

export class Position {
	line: number
	character: number
	constructor(line: number, character: number) {
		this.line = line
		this.character = character
	}
}

export const ViewColumn = { One: 1, Two: 2 }

export const Uri = {
	file: (path: string) => ({ fsPath: path }),
}