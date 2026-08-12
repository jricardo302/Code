import { NextResponse } from "next/server";
import { handleProviderWebhook } from "@/lib/api/webhook-route";

/** Dev/E2E only; the FakeProvider itself also refuses to build in production. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_FAKE_PAYMENTS !== "1") {
    return new NextResponse("not found", { status: 404 });
  }
  return handleProviderWebhook("fake", request);
}
