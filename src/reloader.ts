import { MinecraftServer } from "./websocket";

export class Reloader {
    #server: MinecraftServer | undefined;

    start(port: number) {
        this.#server = new MinecraftServer(port);
    }

    stop() {
        this.#server?.close();
    }

    reload() {
        if (!this.#server) {
            return;
        }

        this.#server.broadcastSendReloadCommand();
    }
}
