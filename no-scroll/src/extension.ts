// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your No Scroll is now active!');

	let disposable = vscode.commands.registerCommand('no-scroll.jumpToNextBreakpoint', () => {
		
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
		}) as vscode.SourceBreakpoint[];
		
		if (fileBreakpoints.length === 0) {
			vscode.window.showInformationMessage('No breakpoints in this file.');
			return;
		}

		for (let i = 0; i < fileBreakpoints.length; i++) {
			const breakpoint = fileBreakpoints[i];
			const line = breakpoint.location.range.start.line;

			if (line > activeEditor.selection.active.line) {
				activeEditor.selection = new vscode.Selection(line, 0, line, 0);
				activeEditor.revealRange(new vscode.Range(line, 0, line, 0));
				return;
			}
		}

		const firstBreakpoint = fileBreakpoints[0];
		const firstLine = firstBreakpoint.location.range.start.line;
		activeEditor.selection = new vscode.Selection(firstLine, 0, firstLine, 0);
		activeEditor.revealRange(new vscode.Range(firstLine, 0, firstLine, 0));

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}