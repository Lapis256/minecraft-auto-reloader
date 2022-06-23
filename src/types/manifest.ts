export interface Module {
    type: "data" | "script" | "resource";
}

export interface Manifest {
    modules: Module[];
}
