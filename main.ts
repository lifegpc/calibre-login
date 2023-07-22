/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { load_settings } from "./config.ts";
import "std/dotenv/load.ts";

export const settings = await load_settings("./config.json");

await start(manifest, {
    plugins: [twindPlugin(twindConfig)],
    port: settings.port,
});
