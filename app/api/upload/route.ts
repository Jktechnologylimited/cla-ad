import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File;
    const folder = (fd.get("folder") as string) || "cla";
    const url = await uploadToCloudinary(file, folder);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
