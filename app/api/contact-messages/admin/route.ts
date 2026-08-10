import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

function internalAdminHeaders(request: Request) {
  const headers = new Headers();
  const internalToken = request.headers.get("x-aibry-internal-token");

  if (internalToken) {
    headers.set("x-aibry-internal-token", internalToken);
  }

  return headers;
}

export async function GET(request: Request) {
  return proxyWebsiteApiRequest("/api/contact-messages/admin", request, {
    headers: internalAdminHeaders(request),
  });
}
