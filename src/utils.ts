import { workspace } from "vscode";

import { EXTENSION_NAME } from "./constants";

export function getConfiguration<T>(section: string): T | undefined {
    return workspace.getConfiguration(EXTENSION_NAME).get<T>(section);
}
