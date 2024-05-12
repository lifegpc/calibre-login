import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import Login from "../islands/Login.tsx";
import { get_string, parse_bool } from "../server/parse_form.ts";
import { encode } from "std/encoding/base64.ts";
import { settings } from "../main.ts";

export const handler: Handlers = {
    GET(_req, ctx) {
        return ctx.render();
    },
    async POST(req, _ctx) {
        const data = await req.formData();
        const username = await get_string(data.get("username"));
        const password = await get_string(data.get("password"));
        const http_only = await parse_bool(data.get("http_only"), true);
        const secure = await parse_bool(data.get("secure"), false);
        if (!username || !password) return new Response("", { status: 400 });
        const t = encode(`${username}:${password}`);
        const headers = {
            "Set-Cookie": `token=${t}; Max-Age=31536000${
                http_only ? "; HttpOnly" : ""
            }${secure ? "; Secure" : ""}`,
        };
        return new Response("", { headers });
    },
};

export default function Home() {
    const i18n = {
        username: settings.username,
        password: settings.password,
        login: settings.login,
    };
    return (
        <>
            <Head>
                <title>calibre-login</title>
                <style>
                    .b-text-field.label {"{"}
                    margin-top: 4px;
                    {"}"}
                </style>
                <link
                    rel="icon"
                    sizes="256x256"
                    type="image/png"
                    href="favicon.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="256x256"
                    href="apple-touch-icon.png"
                />
            </Head>
            <Login i18n={i18n} />
        </>
    );
}
