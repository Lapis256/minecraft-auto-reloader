import { workspace } from "vscode";

import { readFile } from "fs/promises";
import { parse } from "jsonc-parser/lib/esm/main";

import { EXTENSION_NAME } from "./constants";
import { Manifest } from "./types/manifest";

export function getConfiguration<T>(section: string): T | undefined {
    return workspace.getConfiguration(EXTENSION_NAME).get<T>(section);
}

export async function parseManifest(path: string): Promise<Manifest> {
    const text = await readFile(path, "utf-8");
    return parse(text);
}
