"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { Trash2 } from "lucide-react";

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
        <div className={`grid gap-4 md:gap-6 ${
          maxImages === 1 
            ? "grid-cols-1 max-w-md mx-auto" 
            : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
        }`}>
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
            >
              <Image
                src={img.url}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all active:scale-90"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-3 left-3 bg-emerald-900 text-emerald-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-emerald-800/50 backdrop-blur-md">
                  Hero Visual
                </div>
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
            className="w-full border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 rounded-[32px] p-8 md:p-12 flex flex-col items-center gap-4 transition-all group"
          >
            <div className="w-16 h-16 bg-slate-100 group-hover:bg-emerald-100 rounded-[24px] flex items-center justify-center text-3xl transition-colors duration-500">
              📷
            </div>
            <div className="text-center">
              <p className="font-serif text-lg font-bold text-slate-900">Upload Perspective</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {images.length}/{maxImages} High-Res Frames • Visual Storytelling
              </p>
            </div>
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
        <div className="fixed inset-0 z-[999] bg-black/80 flex flex-col">
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
