export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's a local image or doesn't have http, return as is
  if (!src.startsWith("http") || !src.includes("res.cloudinary.com")) {
    return src;
  }

  // Under Cloudinary's Strict Transformations policy, dynamic unsigned width/crop
  // params (like w_1080) are rejected with a 404. Since images are already compressed 
  // via ImageUploader before saving, we safely return the original optimized URL.
  return src;
}
