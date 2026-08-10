import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

interface ContactMessageAdminRouteContext {
  params: {
    messageId: string;
  };
}

function internalAdminHeaders(request: Request) {
  const headers = new Headers();
  const internalToken = request.headers.get("x-aibry-internal-token");

  if (internalToken) {
    headers.set("x-aibry-internal-token", internalToken);
  }

  return headers;
}

export async function PATCH(
  request: Request,
  { params }: ContactMessageAdminRouteContext
) {
  return proxyWebsiteApiRequest(
    `/api/contact-messages/admin/${encodeURIComponent(params.messageId)}`,
    request,
    {
      headers: internalAdminHeaders(request),
    }
  );
}
