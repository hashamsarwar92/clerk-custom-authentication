import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  console.log("Received webhook from Clerk");

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
  }

  const headerPayload = headers();

  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  // ✅ IMPORTANT: raw body (NOT JSON)
  const body = await request.text();

  const webhook = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // ✅ Respond FAST (critical for avoiding 408)
  const eventType = event.type;
  console.log("Event:", eventType);

  // Fire-and-forget processing
  if (eventType === "user.created") {
    console.log("A new user was created with ID:", event.data.id);
  }

  return new Response("OK", { status: 200 });
}