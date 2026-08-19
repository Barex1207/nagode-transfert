import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

if (env.cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
}

export function uploadBufferToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'nagode-transfert', resource_type: 'image' },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Échec upload Cloudinary'));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
