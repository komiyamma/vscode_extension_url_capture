// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
const puppeteer = require('puppeteer');

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
		let dir = getActiveWorkspaceFolder();
	
		const filename = getCurrentDateFilename();
		const selectionText: string = getSelectionText();

		if (selectionText) {
			// テキストにhttps:// が先頭に含まれてなければ付け加える
			const url = selectionText?.startsWith('http') ? selectionText : `https://${selectionText}`;

			captureWebsite(url, dir + "/" + filename);
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


declare const document: any;

async function captureWebsite(url: string, filename: string) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
   
	// ウェブサイトを開く
	await page.goto(url);
   
	// 画面のサイズを取得
	const { width, height } = await page.evaluate(() => {
	  // ほとんどのサイトは1920のFull HDディスプレイの横幅をなんとなく意識している。
	  return { width: Math.round((document.body.scrollWidth + 1920)/2), height: document.body.scrollHeight };
	});
   
	// 画面全体をキャプチャー
	await page.setViewport({ width, height });
	await page.screenshot({ path: filename });
	outputChannel.show();
	outputChannel.appendLine(`Capture URL: ${url}`);
	outputChannel.appendLine(`Capture URL: ${filename}`);
   
	await browser.close();
}


function getCurrentDateFilename(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	return `img_${year}${month}${day}_${hours}${minutes}${seconds}.png`;
}

function getActiveWorkspaceFolder(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('ワークスペースフォルダが開かれていません。');
        return undefined;
    }
    // アクティブなエディタのドキュメントが属するワークスペースフォルダを取得
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const activeDocumentUri = activeEditor.document.uri;
        const activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeDocumentUri);
        if (activeWorkspaceFolder) {
            return activeWorkspaceFolder.uri.fsPath;
        }
    }
    // アクティブなエディタがない場合、最初のワークスペースフォルダを返す
    return workspaceFolders[0].uri.fsPath;
}


// This method is called when your extension is deactivated
export function deactivate() {}
