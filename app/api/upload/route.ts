import { prisma } from "@/lib/prisma";
import { utapi } from "@/lib/uploadthing";
import { NextRequest, NextResponse } from "next/server";
import sharp, { Metadata } from "sharp";

const compressImage = async (file: File, buffer: ArrayBuffer): Promise<File> => {
  const instance = sharp(buffer)
    .toFormat('webp', {
      quality: 10
    });

  const fileName = file.name.split('.').slice(0, -1).join('.') + '-optimized.webp';

  return new File(await instance.toArray(), fileName, {
    type: 'image/webp',
    lastModified: Date.now(),
  });
};

const createThumbnail = async (file: File, buffer: ArrayBuffer): Promise<[File, Metadata]> => {
  const instance = sharp(buffer)
    .resize(null, 150)
    .toFormat('webp', {
      quality: 10
    });

  const fileName = file.name.split('.').slice(0, -1).join('.') + '-thumbnail.webp';
  const metadata = await instance.metadata();

  return [new File(await instance.toArray(), fileName, {
    type: 'image/webp',
    lastModified: Date.now(),
  }), metadata];
};

export const POST = async (request: NextRequest) => {
  const data = await request.formData();
  const file = data.get("file") as File | null;

  if (!file) {
    return NextResponse.json({
      error: "No file uploaded",
    }, { status: 400 });
  }

  try {
    const buffer = await file.arrayBuffer();
    const metadata = await sharp(buffer).metadata();

    const [optimized, [thumbnail, thumbnailMeta]] = await Promise.all([
      compressImage(file, buffer),
      createThumbnail(file, buffer)
    ]);

    const [originalUploaded, optimizedUploaded, thumbnailUploaded] = await utapi.uploadFiles([
      file,
      optimized,
      thumbnail
    ], {
      concurrency: 3,
    });

    if (!originalUploaded.data || !optimizedUploaded.data || !thumbnailUploaded.data) {
      throw new Error("Failed to upload files");
    }

    const object = await prisma.uploads.create({
      data: {
        name: file.name,
        width: metadata.width,
        height: metadata.height,
        type: file.type,

        originalSize: originalUploaded.data.size,
        originalImage: originalUploaded.data.key,

        optimizedImage: optimizedUploaded.data.key,
        optimizedSize: optimized.size,

        thumbnail: thumbnailUploaded.data.key,
        thumbnailSize: thumbnail.size,
        thumbnailWidth: thumbnailMeta.width || 0,
        thumbnailHeight: thumbnailMeta.height || 0,
      }
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      data: object,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      error: "Failed to upload file",
    }, { status: 500 });
  }
};