// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

let outputChannel = vscode.window.createOutputChannel("Capture URL");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "url-capture" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('url-capture.url-capture', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const filename = getCurrentDateFilename();

		const selectionText: string = getSelectionText();

		let openDir = getCurrentFileDirectory();
		if (!openDir) {
			outputChannel.show();
			outputChannel.append(`ファイルを開いている状態でのみ機能します\n`);
		}

		if (selectionText) {
			// テキストにhttps:// が先頭に含まれてなければ付け加える
			const url = selectionText?.startsWith('http') ? selectionText : `https://${selectionText}`;

			captureWebsite(url, filename);
		}
	});

	context.subscriptions.push(disposable);
}


function getSelectionText(): string {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const selection = editor.selection;
		return editor.document.getText(selection);
	}
	return "";
}

function captureWebsite(url: string, filename: string) {
	// 外部コマンドの実行
	const exec = require('child_process').exec;
	const command = `node ${__dirname}/capture.js ${url} ${filename}`;
// 現在vscode開いているファイル名のディレクトリを取得

    exec(command, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
			outputChannel.show();
			outputChannel.append(`エラーが発生しました: ${error.message}\n`);
            return;
        }
        if (stderr) {
            outputChannel.append(`エラーが発生しました: ${stderr}\n`);
            return;
        }
    });	
}


function getCurrentFileDirectory(): string | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }
    const filePath = editor.document.uri.fsPath;
	if (!filePath) {
        return undefined;
	}
    const directoryPath = path.dirname(filePath);
    return directoryPath;
}

function getCurrentDateFilename(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `img_${year}${month}${day}.png`;
}


// This method is called when your extension is deactivated
export function deactivate() {}
