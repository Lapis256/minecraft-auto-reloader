import { WebSocketServer, WebSocket } from "ws";
import { v4 as genUUID } from "uuid";

interface Data<T, U> {
    body: T;
    header: U;
}

type RequestPurpose = "commandRequest";

interface RequestBody {
    commandLine: string;
}

type ResponsePurpose = "commandResponse";

interface ResponseBody {
    statusCode: number;
    statusMessage: string;
}

interface ResponseHeader {
    requestId: string;
    messagePurpose: ResponsePurpose;
    version: number;
}

type ResponseData = Data<ResponseBody, ResponseHeader>;

interface CommandResponse {
    status: number;
    message: string;
}

class MinecraftClient {
    #client;

    constructor(client: WebSocket) {
        this.#client = client;
    }

    send(purpose: RequestPurpose, body: RequestBody, uuid: string = genUUID()) {
        this.#client.send(
            JSON.stringify({
                body,
                header: {
                    requestId: uuid,
                    messagePurpose: purpose,
                    version: 1,
                },
            })
        );
    }

    sendCommand(command: string): Promise<CommandResponse> {
        const uuid = genUUID();
        this.send("commandRequest", { commandLine: command }, uuid);

        return new Promise((resolve) => {
            this.#client.on("message", (data) => {
                const res: ResponseData = JSON.parse(data.toString());

                if (res.header.requestId !== uuid) {
                    return;
                }

                resolve({
                    message: res.body.statusMessage,
                    status: res.body.statusCode,
                });
            });
        });
    }
}

export class MinecraftServer {
    #server;

    constructor(port: number = 8080) {
        this.#server = new WebSocketServer({ port });
    }

    get clients() {
        return new Set(
            Array.from(this.#server.clients).map(
                (client) => new MinecraftClient(client)
            )
        );
    }

    close() {
        this.#server.close();
    }

    broadcastSendCommand(command: string) {
        for (const client of this.clients) {
            client.sendCommand(command);
        }
    }

    broadcastDialogMessage(message: string) {
        this.broadcastSendCommand(
            "tellraw @a " +
                JSON.stringify({
                    rawtext: [{ text: `[Behavior Auto Reloader] ${message}` }],
                })
        );
    }

    broadcastSendReloadCommand() {
        this.broadcastSendCommand("reload");
        this.broadcastDialogMessage("Reloaded");
    }
}
