import { ExtensionContext, commands, window, workspace } from "vscode";

import { MinecraftServer } from "./websocket";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        'Congratulations, your extension "lapis256.minecraft-auto-reloader" is now active!'
    );

    const output = window.createOutputChannel("Behavior Reloader");

    const server = new MinecraftServer(8080);

    output.appendLine("Websocket server opened on port 8080.");
    // workspace.onDidChangeWorkspaceFolders();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand(
        "lapis256.minecraft-auto-reloader.helloWorld",
        () => {
            server.broadcastSendReloadCommand();
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            window.showInformationMessage(
                "Hello World from BehaviorAutoReloader!"
            );
        }
    );

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
