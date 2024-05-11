import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { settings } from "../main.ts";
import { parse_cookies } from "../server/cookies.ts";
import { get_host } from "../server/utils.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
    const u = new URL(req.url);
    if (
        u.pathname.startsWith("/_frsh/") || u.pathname === "/login" ||
        u.pathname == "/logout"
    ) {
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
        const ua = req.headers.get("User-Agent") || "";
        if (ua.match(/^mozilla\/\d+/i)) {
            let redirect_html = import.meta.resolve("../static/redirect.html").slice(7);
            if (Deno.build.os === "windows") {
                redirect_html = redirect_html.slice(1);
            }
            const rhtml = await Deno.readTextFile(redirect_html);
            return new Response(rhtml, {
                headers: {
                    "Content-Type": "text/html",
                },
                status: 401,
                statusText: "Unauthorized",
            });
        }
        const from = encodeURIComponent(`${u.pathname}${u.search}`);
        return Response.redirect(`${get_host(req)}/login?from=${from}`, 302);
    }
    if (u.pathname == "/") {
        let inject_js = import.meta.resolve("../static/inject.js").slice(7);
        if (Deno.build.os === "windows") {
            inject_js = inject_js.slice(1);
        }
        const inject_html = await Deno.readTextFile(inject_js);
        const html = await re.text();
        const inject = `<script>
var logout_text="${settings.logout}";
${inject_html}</script>`;
        return new Response(html.replace("</head>", inject + "</head>"), {
            headers: re.headers,
            status: re.status,
            statusText: re.statusText,
        });
    }
    return re;
}
