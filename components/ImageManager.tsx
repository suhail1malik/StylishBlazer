"use client";
import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageManager({ images, onChange }: Props) {
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState("");

  const addImage = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (!url.startsWith("http")) {
      setError("Valid URL enter karo (http se shuru hona chahiye)");
      return;
    }
    if (images.includes(url)) {
      setError("Ye image already add hai");
      return;
    }
    onChange([...images, url]);
    setNewUrl("");
    setError("");
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        Product Images
      </label>

      {images.length > 0 ? (
        <div className="space-y-3 mb-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3"
            >
              <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-zinc-200 shrink-0 border border-zinc-200 shadow-sm">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 truncate">{url}</p>
                {index === 0 && (
                  <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    ⭐ Main Image
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Move up"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === images.length - 1}
                  title="Move down"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  title="Remove"
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 p-6 border-2 border-dashed border-zinc-200 rounded-xl text-center text-zinc-400 text-sm">
          No images added yet
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => {
            setNewUrl(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addImage();
            }
          }}
          placeholder="https://res.cloudinary.com/..."
          className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={addImage}
          className="px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors shrink-0"
        >
          + Add
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      <p className="text-xs text-zinc-400 mt-1.5">
        Pehli image main image hogi • ↑↓ se order change karo • Enter se bhi add
        hoga
      </p>
    </div>
  );
}
