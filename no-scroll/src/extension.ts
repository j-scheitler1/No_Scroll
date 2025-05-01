// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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
		
					if (line < activeEditor.selection.active.line) {
						activeEditor.selection = new vscode.Selection(line, 0, line, 0);
						activeEditor.revealRange(new vscode.Range(line, 0, line, 0));
						return;
					}
				}
	});

	let setBreakpoint = vscode.commands.registerCommand('no-scroll.setBreakpoint', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showInformationMessage('No active editor.');
			return;
		}
	
		const line = activeEditor.selection.active.line;
		const uri = activeEditor.document.uri;
	
		const existingBreakpoints = vscode.debug.breakpoints.filter(bp =>
			bp instanceof vscode.SourceBreakpoint &&
			bp.location.uri.toString() === uri.toString() &&
			bp.location.range.start.line === line
		);
	
		if (existingBreakpoints.length > 0) {
			vscode.debug.removeBreakpoints(existingBreakpoints);
		} else {
			const breakpoint = new vscode.SourceBreakpoint(
				new vscode.Location(uri, new vscode.Position(line, 0))
			);
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

	context.subscriptions.push(jumpToNextBreakpoint);
	context.subscriptions.push(jumpToPreviousBreakpoint);
	context.subscriptions.push(setBreakpoint);
	context.subscriptions.push(removeAllBreakpoints);
}

// This method is called when your extension is deactivated
export function deactivate() {}