import { mkdir, rename } from "node:fs/promises";
import path from 'path';
import mime from 'mime';
import sharp from 'sharp';
import { getToken } from './token.js';

interface UploadData {
  versions: Versions
}

interface Versions {
  original: string
}

export async function uploadFile(filePath: string, config: any) {
  try {
    const fileName = path.basename(filePath);
    const mimeType = mime.getType(filePath);

    if (!mimeType) {
      throw new Error(`No mime type could be detected for: ${fileName}`);
    }

    const fileBuffer = await Bun.file(filePath).arrayBuffer();
    const { width, height } = mimeType.startsWith('image/') ? await sharp(fileBuffer).metadata() : { width: 1920, height: 1080 };

    console.log(`⬆️  Requesting upload URL for: ${fileName}`);

    const res = await fetch(`https://api.chivent.com/v1/events/${config.EVENT_ID}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getToken(config.EVENT_ID)}`,
        'Request-By': 'guest',
      },
      body: JSON.stringify({
        filename: fileName,
        contentType: mimeType,
        widthPixels: width,
        heightPixels: height,
        fileSizeBytes: fileBuffer.byteLength
      }),
    });

    const uploadData = await res.json() as UploadData;
    if (!uploadData.versions.original) {
      throw new Error('No upload URL returned from API');
    }

    console.log(`📤 Uploading to signed URL: ${uploadData.versions.original.split('?')[0]} for: ${fileName}`);

    const uploadRes = await fetch(uploadData.versions.original, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
    }

    console.log(`✅ Successfully uploaded: ${fileName}`);

    await mkdir(config.UPLOADED_FOLDER, { recursive: true });
    await rename(filePath, path.join(config.UPLOADED_FOLDER, fileName));
    console.log(`📦 Moved to uploaded/: ${fileName}`);

  } catch (err: any) {
    console.error(`❌ Upload error for ${filePath}:`, err.message);
  }
}