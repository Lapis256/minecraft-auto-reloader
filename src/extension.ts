import {
    ExtensionContext,
    commands,
    window,
    workspace,
    StatusBarAlignment,
    Disposable,
} from "vscode";

import { Reloader } from "./reloader";

const EXTENSION_NAME = "lapis256.minecraft-auto-reloader";
const START_SERVER_COMMAND = `${EXTENSION_NAME}.startServer`;
const STOP_SERVER_COMMAND = `${EXTENSION_NAME}.stopServer`;

const status = window.createStatusBarItem(StatusBarAlignment.Right);

function setStartedStatus(port: number) {
    status.text = `WSS Port: ${port}`;
    status.tooltip = "Click to stop websocket server.";
    status.command = STOP_SERVER_COMMAND;
}

function setStoppedStatus() {
    status.text = "Start WebSocket Server";
    status.tooltip = "Click to start websocket server.";
    status.command = START_SERVER_COMMAND;
}

function getConfiguration<T>(section: string): T | undefined {
    return workspace.getConfiguration(EXTENSION_NAME).get<T>(section);
}

const reloader = new Reloader();

export function activate(context: ExtensionContext) {
    const output = window.createOutputChannel("Minecraft Auto Reloader");

    setStoppedStatus();
    status.show();

    let onChangeEventHandler: Disposable;

    context.subscriptions.push(
        commands.registerCommand(START_SERVER_COMMAND, () => {
            const port = getConfiguration<number>("port")!;

            reloader.start(port);
            setStartedStatus(port);

            output.appendLine(`Websocket server opened on port ${port}.`);

            onChangeEventHandler = workspace.onDidSaveTextDocument((ev) => {
                output.appendLine(`Reload: ${ev.fileName}`);
                reloader.reload();
            });
        })
    );

    context.subscriptions.push(
        commands.registerCommand(STOP_SERVER_COMMAND, () => {
            reloader.stop();
            setStoppedStatus();

            output.appendLine(`Websocket server closed.`);

            onChangeEventHandler.dispose();
        })
    );
}

export function deactivate() {
    reloader.stop();
    status.dispose();
}
