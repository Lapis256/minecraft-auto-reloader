import { ExtensionContext, commands } from "vscode";

import { START_SERVER_COMMAND, STOP_SERVER_COMMAND } from "./constants";

import { AutoReloader } from "./autoReloader";

export async function activate(context: ExtensionContext) {
    const autoReloader = new AutoReloader();
    const startCommand = commands.registerCommand(START_SERVER_COMMAND, () =>
        autoReloader.start()
    );
    const stopCommand = commands.registerCommand(STOP_SERVER_COMMAND, () =>
        autoReloader.stop()
    );
    context.subscriptions.concat(autoReloader, startCommand, stopCommand);
}
