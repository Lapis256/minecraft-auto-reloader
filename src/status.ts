import { window, StatusBarAlignment } from "vscode";

import { START_SERVER_COMMAND, STOP_SERVER_COMMAND } from "./constants";

export class Status {
    #statusBar;

    constructor() {
        this.#statusBar = window.createStatusBarItem(StatusBarAlignment.Right);

        this.setStoppedStatus();
    }

    setStartedStatus(port: number) {
        this.#statusBar.text = `WSS Port: ${port}`;
        this.#statusBar.tooltip = "Click to stop websocket server.";
        this.#statusBar.command = STOP_SERVER_COMMAND;
    }

    setStoppedStatus() {
        this.#statusBar.text = "Start WebSocket Server";
        this.#statusBar.tooltip = "Click to start websocket server.";
        this.#statusBar.command = START_SERVER_COMMAND;
    }

    show() {
        this.#statusBar.show();
    }

    dispose() {
        this.#statusBar.dispose();
    }
}
