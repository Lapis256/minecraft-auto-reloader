import {
    window,
    workspace,
    OutputChannel,
    FileSystemWatcher,
    Uri,
} from "vscode";

import { Status } from "./status";
import { getConfiguration } from "./utils";
import { MinecraftServer } from "./websocket";

export class AutoReloader {
    server!: MinecraftServer;
    status!: Status;
    output!: OutputChannel;
    watcher!: FileSystemWatcher;

    constructor() {
        this.init();
    }

    init() {
        this.status = new Status();
        this.status.show();

        this.output = window.createOutputChannel("Minecraft Auto Reloader");
    }

    start() {
        const port = getConfiguration<number>("port")!;
        this.#startServer(port);

        this.status.setStartedStatus(port);
        this.output.appendLine(`Websocket server opened on port ${port}.`);

        this.#startWatchFiles();
    }

    stop() {
        this.watcher.dispose();
        this.server.dispose();
        this.status.setStoppedStatus();

        this.output.appendLine(`Websocket server closed.`);
    }

    dispose() {
        this.watcher.dispose();
        this.server.dispose();
        this.status.dispose();
        this.output.dispose();
    }

    #startServer(port: number) {
        this.server = new MinecraftServer(port);
    }

    #startWatchFiles() {
        const watcher = workspace.createFileSystemWatcher(
            "**/{scripts,functions}/**/*.{js,json,mcfunction}",
            false,
            false,
            false
        );
        watcher.onDidChange(async (uri) => await this.#reload(uri));
        watcher.onDidCreate(async (uri) => await this.#reload(uri));
        watcher.onDidDelete(async (uri) => await this.#reload(uri));

        this.watcher = watcher;
    }

    async #reload(uri: Uri) {
        for (const client of this.server.clients) {
            const { status, message } = await client.sendCommand("reload");
            if (status === 0) {
                return client.sendMessage(
                    "[Auto Reloader] Reloading was successful."
                );
            }
            client.sendMessage(
                `[Auto Reloader] Reload failed.\nError: ${message}`
            );
        }
        this.output.appendLine(`Reloaded: ${uri.fsPath}`);
    }
}
