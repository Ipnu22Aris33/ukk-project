import imageCompression from 'browser-image-compression';
import { UploadType } from './service';

async function compressImage(file: File) {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8,
  });
}

export async function uploadImage(file: File, type: UploadType) {
  const compressed = await compressImage(file);

  const formData = new FormData();
  formData.append('file', compressed, `${Date.now()}.webp`);
  formData.append('type', type);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload gagal');

  return res.json();
}
