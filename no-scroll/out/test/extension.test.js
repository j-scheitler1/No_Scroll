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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
suite('No Scroll Extension Test Suite', () => {
    suiteSetup(async () => {
        const doc = await vscode.workspace.openTextDocument({ content: 'print("Hello")\nprint("World")' });
        await vscode.window.showTextDocument(doc);
    });
    suiteTeardown(() => {
        vscode.window.showInformationMessage('All tests done!');
    });
    test('Set and remove a breakpoint with toggle', async () => {
        const doc = await vscode.workspace.openTextDocument({ content: 'line1\nline2\nline3' });
        const editor = await vscode.window.showTextDocument(doc);
        const line = 1;
        editor.selection = new vscode.Selection(line, 0, line, 0);
        // Toggle ON
        await vscode.commands.executeCommand('no-scroll.setBreakpoint');
        assert.strictEqual(vscode.debug.breakpoints.length, 1);
        // Toggle OFF
        await vscode.commands.executeCommand('no-scroll.setBreakpoint');
        assert.strictEqual(vscode.debug.breakpoints.length, 0);
    });
    test('Jump to next breakpoint wraps correctly', async () => {
        const doc = await vscode.workspace.openTextDocument({ content: 'a\nb\nc\nd\ne' });
        const editor = await vscode.window.showTextDocument(doc);
        const bp1 = new vscode.SourceBreakpoint(new vscode.Location(doc.uri, new vscode.Position(1, 0)));
        const bp2 = new vscode.SourceBreakpoint(new vscode.Location(doc.uri, new vscode.Position(4, 0)));
        vscode.debug.addBreakpoints([bp1, bp2]);
        editor.selection = new vscode.Selection(4, 0, 4, 0);
        await vscode.commands.executeCommand('no-scroll.jumpToNextBreakpoint');
        assert.strictEqual(editor.selection.active.line, 1);
        vscode.debug.removeBreakpoints([bp1, bp2]);
    });
    test('Toggle between open files changes editor', async () => {
        const doc1 = await vscode.workspace.openTextDocument({ content: 'doc1' });
        const doc2 = await vscode.workspace.openTextDocument({ content: 'doc2' });
        await vscode.window.showTextDocument(doc1, vscode.ViewColumn.One);
        await vscode.window.showTextDocument(doc2, vscode.ViewColumn.One);
        const activeBefore = vscode.window.activeTextEditor?.document.uri.toString();
        await vscode.commands.executeCommand('no-scroll.toggleBetweenFiles');
        const activeAfter = vscode.window.activeTextEditor?.document.uri.toString();
        assert.notStrictEqual(activeBefore, activeAfter, 'Toggled file should be different');
    });
    test('Remove all breakpoints & skip UI interaction', async () => {
        await vscode.commands.executeCommand('no-scroll.removeAllBreakpoints');
        assert.ok(true, 'Command executed without crashing.');
    });
});
//# sourceMappingURL=extension.test.js.map