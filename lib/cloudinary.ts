import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File, folder = "cla"): Promise<string> {
  const bytes  = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder, resource_type: "auto" });
  return result.secure_url;
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
