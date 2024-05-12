import { exists } from "std/fs/exists.ts";
import { JsonValue, parse } from "std/jsonc/mod.ts";

export class Config {
    _data;
    constructor(data: JsonValue) {
        this._data = <{ [x: string]: unknown }> <unknown> Object.assign(
            {},
            data,
        );
    }
    _return_string(key: string) {
        const v = this._data[key];
        if (v === undefined || typeof v === "string") {
            return v;
        }
        throw new Error(`Config ${key} value ${v} is not a string`);
    }
    _return_number(key: string) {
        const v = this._data[key];
        if (v === undefined) return undefined;
        if (typeof v === "number") {
            return v;
        }
        throw new Error(`Config ${key} value ${v} is not a number`);
    }
    get calibre() {
        return this._return_string("calibre");
    }
    get port() {
        return this._return_number("port");
    }
    get logout() {
        return this._return_string("logout") || "Log out";
    }
    get username() {
        return this._return_string("username");
    }
    get password() {
        return this._return_string("password");
    }
    get login() {
        return this._return_string("login");
    }
}

export async function load_settings(path: string) {
    if (!await exists(path)) return new Config({});
    let s = (new TextDecoder()).decode(await Deno.readFile(path));
    while (!s.length) {
        s = (new TextDecoder()).decode(await Deno.readFile(path));
    }
    return new Config(parse(s));
}

export function save_settings(path: string, cfg: Config, signal?: AbortSignal) {
    return Deno.writeTextFile(path, JSON.stringify(cfg._data), { signal });
}
