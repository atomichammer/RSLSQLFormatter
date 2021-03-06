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

		const config = vscode.workspace.getConfiguration('sqlformatter');
		const varName = config.get('varName')
		const alignRight = config.get('alignRightQuotes')

		const str = word.trim()
		if (!str.length) { return word }
		const strArr = str.split("\n")

		let res = varName + ' = '
		const indentation = ' '.repeat(res.length)

		let rightIndentationLength = 0

		if(alignRight)
		{
			strArr.forEach((str2) => {
				if (str2.length > rightIndentationLength)
				{
					rightIndentationLength = str2.length
				}
			})
		}

		strArr.forEach((str2, idx) => {
			if(idx == 0)
			{
				res = res + '"' + (str2).trimEnd().padEnd(rightIndentationLength, ' ') + ' " +\n'
				return
			}
			else if (idx == strArr.length - 1){
				res = res + indentation + '"' + (str2).trimEnd().padEnd(rightIndentationLength, ' ') +' ";'
				return
			}
			res = res + indentation + '"' + (str2).trimEnd().padEnd(rightIndentationLength, ' ') +' " +\n'
		})

		editor.edit(builder => {
			builder.replace(selection, res)
		})
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('sqlformatter.unFormatSQL', async() => {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No text editor open. Aborting.');
			return; // No open text editor
		}

		const document = editor.document
		const selection = editor.selection
		const word = document.getText(selection)

		const config = vscode.workspace.getConfiguration('sqlformatter');
		const varName = config.get('varName')
		const alignRight = config.get('alignRightQuotes')

		let text = word.replace(/"/g, '')
		text = text.replace(/\+/g, '')
		text = text.replace(varName + ' = ', '')
		let result = ''

		text.split("\n").forEach((str) => {
			result += str.trim() + "\n"
		})

        await copyToClipboard(result)

	})

	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function copyToClipboard(text: string) {
    // do not copy empty text
    if (text.trim() === '') {
        return;
    }

    // copy
    try {
        await vscode.env.clipboard.writeText(text);
    } catch (error) {
        vscode.window.showErrorMessage(`copy-on-select failed. Error: ${JSON.stringify(error)}`);
    }
}
