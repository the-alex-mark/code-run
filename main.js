'use strict';
const vscode = require('vscode');
const path = require('path');

function IsRunFromExplorer(URI) {
    const editor = vscode.window.activeTextEditor;

    if (!URI || !URI.fsPath) return false;
    if (!editor) return true;
    if (URI.fsPath === editor.document.uri.fsPath) return false;

    return true;
}

function Execute(URL) {
    let expansion = path.extname(URL);
    let command = "";
    switch (expansion) {
        case '.js':
            command = `node "${URL}"`;
            break;
        
        case '.bat':
            command = `"${URL}"`;
            break;
        
        default:
            return;
    }

    const activeTerminal = vscode.window.activeTerminal;
    if (activeTerminal) {
        activeTerminal.show(true);
        activeTerminal.sendText(command, true);
    }
    else {
        const terminal = vscode.window.createTerminal();
        terminal.show(true);
        terminal.sendText(command, true);
    }
}

exports.activate = function (context) {
    const run = vscode.commands.registerCommand("code.run", (URI) => {
        const editor = vscode.window.activeTextEditor;
        let URL = (IsRunFromExplorer(URI)) ? URI.fsPath : editor.document.uri.fsPath;

        Execute(URL);
    });

    context.subscriptions.push(run);
}

exports.deactivate = function () {
    
}