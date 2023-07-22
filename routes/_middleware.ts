import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { settings } from "../main.ts";
import { parse_cookies } from "../server/cookies.ts";
import { get_host } from "../server/utils.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
    const u = new URL(req.url);
    if (u.pathname.startsWith("/_frsh/") || u.pathname === "/login") {
        return await ctx.next();
    }
    if (!settings.calibre) {
        return new Response("Calibre server is not seted.", { status: 500 });
    }
    const headers = new Headers(req.headers);
    const c = new URL(settings.calibre);
    headers.set("Host", c.host);
    if (!headers.has("X-Forwarded-For")) {
        headers.set("X-Forwarded-For", `${ctx.remoteAddr.hostname}`);
    }
    if (!headers.has("X-Forwarded-Host")) {
        headers.set("X-Forwarded-Host", u.host);
    }
    const cookies = parse_cookies(headers.get("Cookie"));
    headers.delete("Cookie");
    if (cookies.has("token")) {
        headers.set("Authorization", `Basic ${cookies.get("token")}`);
    }
    const re = await fetch(`${settings.calibre}${u.pathname}${u.search}`, {
        headers,
        method: req.method,
        redirect: "manual",
        body: req.body,
    });
    if (re.status === 101) return re;
    if (re.status === 401) {
        return Response.redirect(`${get_host(req)}/login`, 302);
    }
    return re;
}
