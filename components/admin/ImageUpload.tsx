'use client';
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface Props {
  currentUrl: string | null | undefined;
  memberName: string;
  onUploaded: (url: string) => void;
}

async function resizeToSquare(file: File, size = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Cover-crop: scale so the shorter side fills the canvas
      const scale = Math.max(size / img.width, size / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      const ox = (size - sw) / 2;
      const oy = (size - sh) / 2;

      ctx.drawImage(img, ox, oy, sw, sh);
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function ImageUpload({ currentUrl, memberName, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarSrc = currentUrl
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName || 'T')}&background=0B1117&color=00C896&size=200&bold=true`;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const resized = await resizeToSquare(file, 400);
      const formData = new FormData();
      formData.append('file', resized, `avatar.jpg`);

      const res = await fetch('/api/admin/team/avatar', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Upload failed');
      onUploaded(json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 flex-shrink-0">
        <img
          src={avatarSrc}
          alt={memberName}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-700"
          onError={(e) => {
            const img = e.currentTarget;
            const name = encodeURIComponent(memberName || 'T');
            img.src = `https://ui-avatars.com/api/?name=${name}&background=0B1117&color=00C896&size=200&bold=true`;
          }}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white disabled:opacity-50"
        >
          <Upload size={12} /> {uploading ? 'Uploading…' : 'Upload photo'}
        </button>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="sr-only"
        />
      </div>
    </div>
  );
}
