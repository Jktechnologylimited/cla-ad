export const dynamic = "force-dynamic";
import sql from "@/lib/db";
import EnquiriesClient from "./client";
export default async function EnquiriesPage() {
  const enquiries = await sql`SELECT * FROM "AdmissionEnquiry" ORDER BY "createdAt" DESC`;
  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e: any) => e.status === 'NEW').length,
    contacted: enquiries.filter((e: any) => e.status === 'CONTACTED').length,
    enrolled: enquiries.filter((e: any) => e.status === 'ENROLLED').length,
  };
  return <EnquiriesClient initialEnquiries={enquiries} stats={stats} />;
}
