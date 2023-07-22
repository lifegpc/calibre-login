export function get_host(req: Request) {
    const u = new URL(req.url);
    const proto = req.headers.get("X-Forwarded-Proto");
    const host = req.headers.get("X-Forwarded-Host");
    return proto ? `${proto}://${host || u.host}` : u.origin;
}
