export const dynamic = "force-dynamic";
import sql from "@/lib/db";
import MessagesClient from "./client";
export default async function MessagesPage() {
  const messages = await sql`SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC`;
  return <MessagesClient initialMessages={messages} />;
}
