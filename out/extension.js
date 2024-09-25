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
        const filename = getCurrentDateFilename();
        const selectionText = getSelectionText();
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
function getSelectionText() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        return editor.document.getText(selection);
    }
    return "";
}
function captureWebsite(url, filename) {
    // 外部コマンドの実行
    const exec = require('child_process').exec;
    const command = `node ${__dirname}/capture.js ${url} ${filename}`;
    // 現在vscode開いているファイル名のディレクトリを取得
    exec(command, (error, stdout, stderr) => {
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
function getCurrentFileDirectory() {
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
function getCurrentDateFilename() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `img_${year}${month}${day}.png`;
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map