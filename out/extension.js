"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const puppeteer = require('puppeteer');
let outputChannel = vscode.window.createOutputChannel("Capture URL");
function activate(context) {
    const disposable = vscode.commands.registerCommand('url-capture.url-capture', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let dir = getActiveWorkspaceFolder();
        const filename = getCurrentDateFilename();
        const selectionText = getSelectionText();
        if (selectionText) {
            // テキストにhttps:// が先頭に含まれてなければ付け加える
            const url = selectionText?.startsWith('http') ? selectionText : `https://${selectionText}`;
            captureWebsite(url, dir + "/" + filename);
        }
    });
    context.subscriptions.push(disposable);
}
function getSelectionText() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        return editor.document.getText(selection);
    }
    return "";
}
async function captureWebsite(url, filename) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        // URLへのアクセスに2秒のタイムアウトを設定
        const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 2500 });
        // レスポンスのステータスを確認
        if (!response || !response.ok()) {
            throw new Error(`Failed to load the page. Status: ${response ? response.status() : 'No response'}`);
        }
        // 画面のサイズを取得
        const { width, height } = await page.evaluate(() => {
            return { width: Math.round((document.body.scrollWidth + 1920) / 2), height: document.body.scrollHeight };
        });
        // 画面全体をキャプチャー
        await page.setViewport({ width, height });
        await page.screenshot({ path: filename });
        outputChannel.show();
        outputChannel.appendLine(`Capture URL: ${url}`);
        console.log(`Captured screenshot saved to: ${filename}`);
    }
    catch (error) {
        outputChannel.show();
        outputChannel.appendLine(`Error: ${error.message}`);
    }
    finally {
        await browser.close();
    }
}
function getCurrentDateFilename() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `img_${year}${month}${day}_${hours}${minutes}${seconds}.png`;
}
function getActiveWorkspaceFolder() {
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
function deactivate() { }
//# sourceMappingURL=extension.js.map