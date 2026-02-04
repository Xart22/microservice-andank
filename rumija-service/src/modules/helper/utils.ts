import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadsDir = path.join(__dirname, "../../uploads/rumija");
export const uploadRumija = path.join(__dirname, "../../uploads/rumija/images");

export const ensureUploadDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(uploadRumija, { recursive: true });
};
