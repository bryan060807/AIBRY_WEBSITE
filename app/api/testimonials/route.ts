import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function GET(request: Request) {
  return proxyWebsiteApiRequest("/api/v1/testimonials", request);
}

export async function POST(request: Request) {
  return proxyWebsiteApiRequest("/api/v1/testimonials", request);
}
