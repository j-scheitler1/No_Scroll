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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, No Scroll is now active!');
    let jumpToNextBreakpoint = vscode.commands.registerCommand('no-scroll.jumpToNextBreakpoint', () => {
        // Get the current breakpoints in the file
        const breakpoints = vscode.debug.breakpoints;
        if (breakpoints.length === 0) {
            vscode.window.showInformationMessage('No breakpoints set.');
            return;
        }
        // Get the currently active editor
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('No active editor.');
            return;
        }
        const currentFile = activeEditor.document.uri.toString();
        // Filter to breakpoints in the current file
        const fileBreakpoints = breakpoints.filter(bp => {
            if (bp instanceof vscode.SourceBreakpoint) {
                return bp.location.uri.toString() === currentFile;
            }
            return false;
        });
        if (fileBreakpoints.length === 0) {
            vscode.window.showInformationMessage('No breakpoints in this file.');
            return;
        }
        //Get the line number where the cursor is.
        const currentLine = activeEditor.selection.active.line;
        //Get all breakpoints and sort them.
        const sorted = fileBreakpoints
            .map(bp => bp.location.range.start.line)
            .sort((a, b) => a - b);
        //Get the first line that is greater than the current.
        const nextLine = sorted.find(line => line > currentLine);
        //If it exists then go to it, otherwise wrap to the first.
        const targetLine = nextLine !== undefined ? nextLine : sorted[0];
        //Move cursor to the beginning of the target line.
        activeEditor.selection = new vscode.Selection(targetLine, 0, targetLine, 0);
        //Scroll so the line is in a good spot on the screen.
        activeEditor.revealRange(new vscode.Range(Math.max(targetLine - 3, 0), 0, targetLine, 0), vscode.TextEditorRevealType.AtTop);
    });
    let jumpToPreviousBreakpoint = vscode.commands.registerCommand('no-scroll.jumpToPreviousBreakpoint', () => {
        const breakpoints = vscode.debug.breakpoints;
        if (breakpoints.length === 0) {
            vscode.window.showInformationMessage('No breakpoints set.');
            return;
        }
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('No active editor.');
            return;
        }
        const currentFile = activeEditor.document.uri.toString();
        const fileBreakpoints = breakpoints.filter(bp => {
            return bp instanceof vscode.SourceBreakpoint &&
                bp.location.uri.toString() === currentFile;
        });
        if (fileBreakpoints.length === 0) {
            vscode.window.showInformationMessage('No breakpoints in this file.');
            return;
        }
        //Get the line number where the cursor is.
        const currentLine = activeEditor.selection.active.line;
        //Get all breakpoints and sort them.
        const sorted = fileBreakpoints
            .map(bp => bp.location.range.start.line)
            .sort((a, b) => b - a);
        //Get the first line that is less than the current.
        const previousLine = sorted.find(line => line < currentLine);
        //If it exists then go to it, otherwise wrap to the first.
        const targetLine = previousLine !== undefined ? previousLine : sorted[0];
        //Move cursor to the beginning of the target line.
        activeEditor.selection = new vscode.Selection(targetLine, 0, targetLine, 0);
        //Scroll so the line is in a good spot on the screen.
        activeEditor.revealRange(new vscode.Range(Math.max(targetLine - 3, 0), 0, targetLine, 0), vscode.TextEditorRevealType.AtTop);
    });
    let setBreakpoint = vscode.commands.registerCommand('no-scroll.setBreakpoint', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('No active editor.');
            return;
        }
        const line = activeEditor.selection.active.line;
        const uri = activeEditor.document.uri;
        const existingBreakpoints = vscode.debug.breakpoints.filter(bp => bp instanceof vscode.SourceBreakpoint &&
            bp.location.uri.toString() === uri.toString() &&
            bp.location.range.start.line === line);
        if (existingBreakpoints.length > 0) {
            vscode.debug.removeBreakpoints(existingBreakpoints);
        }
        else {
            const breakpoint = new vscode.SourceBreakpoint(new vscode.Location(uri, new vscode.Position(line, 0)));
            vscode.debug.addBreakpoints([breakpoint]);
        }
    });
    let removeAllBreakpoints = vscode.commands.registerCommand('no-scroll.removeAllBreakpoints', () => {
        const breakpoints = vscode.debug.breakpoints;
        if (breakpoints.length === 0) {
            vscode.window.showInformationMessage('No breakpoints set.');
            return;
        }
        vscode.debug.removeBreakpoints(breakpoints);
        vscode.window.showInformationMessage('All breakpoints removed.');
    });
    let toggleBetweenFiles = vscode.commands.registerCommand('no-scroll.toggleBetweenFiles', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showInformationMessage('No active editor.');
            return;
        }
        const currentUri = activeEditor.document.uri;
        const activeGroup = vscode.window.tabGroups.activeTabGroup;
        const tabs = activeGroup.tabs;
        // Get all URIs of open tabs
        const tabUris = tabs.map(tab => {
            if (tab.input instanceof vscode.TabInputText || tab.input instanceof vscode.TabInputNotebook) {
                return tab.input.uri;
            }
            if (tab.input instanceof vscode.TabInputTextDiff || tab.input instanceof vscode.TabInputNotebookDiff) {
                return tab.input.modified;
            }
            return null;
        }).filter(Boolean);
        // Find current file index
        const currentIndex = tabUris.findIndex(uri => uri.toString() === currentUri.toString());
        if (currentIndex === -1 || tabUris.length < 2) {
            vscode.window.showInformationMessage('No other files to toggle to.');
            return;
        }
        const nextIndex = (currentIndex + 1) % tabUris.length;
        const nextUri = tabUris[nextIndex];
        try {
            await vscode.window.showTextDocument(nextUri, { viewColumn: vscode.ViewColumn.Active });
        }
        catch (error) {
            console.error('Failed to open file:', error);
            vscode.window.showErrorMessage('Failed to open the next file.');
        }
    });
    context.subscriptions.push(toggleBetweenFiles);
    context.subscriptions.push(jumpToNextBreakpoint);
    context.subscriptions.push(jumpToPreviousBreakpoint);
    context.subscriptions.push(setBreakpoint);
    context.subscriptions.push(removeAllBreakpoints);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map