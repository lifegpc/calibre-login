import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
    GET(_req, _ctx) {
        const headers = {
            "Set-Cookie": "token=; Max-Age=0",
            "Location": "/login",
        };
        return new Response("", {
            headers,
            status: 303,
            statusText: "See Other",
        });
    },
};
