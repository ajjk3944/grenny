import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export interface MediaUploadResult {
  originalUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export const uploadImage = async (
  buffer: Buffer,
  userId: string
): Promise<MediaUploadResult> => {
  const metadata = await sharp(buffer).metadata();

  const compressed = await sharp(buffer)
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const thumbnail = await sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .jpeg({ quality: 70 })
    .toBuffer();

  const [originalUpload, thumbnailUpload] = await Promise.all([
    new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `greenbd/submissions/${userId}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(compressed);
    }),
    new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `greenbd/thumbnails/${userId}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(thumbnail);
    }),
  ]);

  return {
    originalUrl: originalUpload.secure_url,
    thumbnailUrl: thumbnailUpload.secure_url,
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: compressed.length,
  };
};

export const uploadVideo = async (
  buffer: Buffer,
  userId: string
): Promise<MediaUploadResult> => {
  const upload = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `greenbd/submissions/${userId}`,
        resource_type: 'video',
        transformation: [
          { width: 1280, height: 720, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

  const thumbnailUrl = upload.secure_url.replace(/\.[^.]+$/, '.jpg');

  return {
    originalUrl: upload.secure_url,
    thumbnailUrl,
    width: upload.width || 0,
    height: upload.height || 0,
    format: upload.format || 'unknown',
    size: buffer.length,
  };
};
