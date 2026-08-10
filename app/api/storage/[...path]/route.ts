import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function GET(
  request: Request,
  { params }: { params: { path?: string[] } }
) {
  const objectPath = (params.path ?? []).map(encodeURIComponent).join("/");
  return proxyWebsiteApiRequest(`/api/v1/storage/${objectPath}`, request);
}
