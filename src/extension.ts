// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "sqlformatter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('sqlformatter.formatSQL', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from SqlFormatter!');

		// check if editor is open
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No text editor open. Aborting.');
			return; // No open text editor
		}

		const document = editor.document
		const selection = editor.selection
		const word = document.getText(selection)

		const str = word.trim()
		if (!str.length) { return word }
		const strArr = str.split("\n")

		let res = ''


		strArr.forEach((str2, idx) => {
			if(idx == 0)
			{
				res = res + '"' + (str2).trimEnd() + ' " +\n'
				return
			}
			else if (idx == strArr.length - 1){
				res = res + '        "' + (str2).trimEnd() + ' ";'
				return
			}
			res = res + '        "' + (str2).trimEnd() + ' " +\n'
		})

		res = 'query = ' + res

		editor.edit(builder => {
			builder.replace(selection, res)
		})
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
