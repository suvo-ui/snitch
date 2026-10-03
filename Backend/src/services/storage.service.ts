import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

interface UploadImageOptions {
  file: Buffer;
  fileName: string;
  mimeType: string;
  folder?: string;
}

export async function uploadImage({
  file,
  fileName,
  mimeType,
  folder = "snitch",
}: UploadImageOptions): Promise<string> {
  const uploadFile = await toFile(file, fileName, { type: mimeType });
  const uploadResponse = await client.files.upload({
    file: uploadFile,
    fileName: fileName,
    folder: folder,
  });
  if (!uploadResponse.url) {
    throw new Error("ImageKit upload did not return a URL");
  }
  return uploadResponse.url;
}
