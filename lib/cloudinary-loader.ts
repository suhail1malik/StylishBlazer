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

  // Avoid inserting if transformations already exist
  if (src.includes("/upload/f_") || src.includes("/upload/q_") || src.includes("/upload/w_")) {
    return src;
  }

  // Cloudinary transformations
  // f_auto: best format
  // q_auto: best quality
  // c_limit,w_WIDTH: resize to width but don't upscale
  const q = quality ? `q_${quality}` : "q_auto";
  const params = [`f_auto`, q, `c_limit`, `w_${width}`].join(",");

  // Replace '/upload/' with '/upload/params/'
  return src.replace("/upload/", `/upload/${params}/`);
}
