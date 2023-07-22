export function get_host(req: Request) {
    const u = new URL(req.url);
    const proto = req.headers.get("X-Forwarded-Proto");
    return proto ? `${proto}://${u.host}` : u.origin;
}
