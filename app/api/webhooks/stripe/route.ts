import { handleProviderWebhook } from "@/lib/api/webhook-route";

export async function POST(request: Request) {
  return handleProviderWebhook("stripe", request);
}
