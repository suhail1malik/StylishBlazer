"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";

interface Point {
  x: number;
  y: number;
}
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

interface Props {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

// Canvas se cropped image nikalna
async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob> {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob());
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9),
  );
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop state
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(3 / 4); // Default: portrait (product images)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // File select hone pe crop modal open karo
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset so same file select ho sake
  }

  // Crop confirm → Cloudinary upload
  async function handleCropConfirm() {
    if (!cropSrc || !croppedAreaPixels) return;
    setUploading(true);

    try {
      const croppedBlob = await getCroppedImage(cropSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedBlob, "product.jpg");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange([...images, { url: data.url, publicId: data.publicId }]);
      setCropSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // Image delete karo Cloudinary se bhi
  async function handleDelete(index: number) {
    const img = images[index];
    const confirmed = window.confirm("Is image ko delete karna chahte ho?");
    if (!confirmed) return;

    try {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.publicId }),
      });
    } catch {
      // Delete fail hone pe bhi UI se hatao
    }

    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group aspect-3/4 rounded-xl overflow-hidden border-2 border-gray-200"
            >
              <Image
                src={img.url}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 20vw"
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-1.5 right-1.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                ✕
              </button>
              {/* Order badge */}
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-6 flex flex-col items-center gap-2 transition-all"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              📷
            </div>
            <p className="font-medium text-gray-700">Photo Upload karo</p>
            <p className="text-xs text-gray-400">
              {images.length}/{maxImages} images • JPG, PNG, WEBP
            </p>
          </button>
        </div>
      )}

      {/* Aspect Ratio Selector */}
      <div className="flex gap-2 flex-wrap">
        <p className="text-xs text-gray-500 w-full">Crop ratio:</p>
        {[
          { label: "3:4 Portrait", value: 3 / 4 },
          { label: "1:1 Square", value: 1 },
          { label: "4:3 Landscape", value: 4 / 3 },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setAspectRatio(opt.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              aspectRatio === opt.value
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Crop Modal - WhatsApp style */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <button
              type="button"
              onClick={() => {
                setCropSrc(null);
                setZoom(1);
              }}
              className="text-white text-sm font-medium"
            >
              Cancel
            </button>
            <h3 className="text-white font-semibold">Crop Image</h3>
            <button
              type="button"
              onClick={handleCropConfirm}
              disabled={uploading}
              className="text-blue-400 text-sm font-semibold disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Done ✓"}
            </button>
          </div>

          {/* Crop Area */}
          <div className="flex-1 relative">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={true}
              style={{
                containerStyle: { background: "#000" },
                cropAreaStyle: { border: "2px solid #3b82f6" },
              }}
            />
          </div>

          {/* Zoom Slider */}
          <div className="px-6 py-4 bg-gray-900 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Zoom</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-xs text-gray-500 text-center">
              Pinch to zoom • Drag to position
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
