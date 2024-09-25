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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const puppeteer = require('puppeteer');
let outputChannel = vscode.window.createOutputChannel("Capture URL");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "url-capture" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('url-capture.url-capture', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const dir = getCurrentDateFilename();
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
var document;
async function captureWebsite(url, filename) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // ウェブサイトを開く
    await page.goto(url);
    // 画面のサイズを取得
    const { width, height } = await page.evaluate(() => {
        // ほとんどのサイトは1920のFull HDディスプレイの横幅をなんとなく意識している。
        return { width: Math.round((document.body.scrollWidth + 1920) / 2), height: document.body.scrollHeight };
    });
    // 画面全体をキャプチャー
    await page.setViewport({ width, height });
    await page.screenshot({ path: filename });
    await browser.close();
}
function getCurrentDateFilename() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `img_${year}${month}${day}.png`;
}
function getCurrentFileDirectory() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }
    const filePath = editor.document.uri.fsPath;
    const directoryPath = path.dirname(filePath);
    return directoryPath;
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map