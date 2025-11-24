import { FastifyReply, FastifyRequest } from "fastify";

import { DataUmumFileService } from "./data-umum-file.service.js";
import { uploadsDir } from "../../helper/utils.js";
import path from "path";
import { pipeline } from "stream/promises";
import { createWriteStream, createReadStream } from "fs";

export class DataUmumFileController {
  constructor(private dataUmumFileService: DataUmumFileService) {}

  createDataUmumFile = async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ message: "Body must be object" });
    }

    // file dari multipart
    const file = body.file;

    if (!file || !file.file) {
      return reply.code(400).send({ message: "Image file is required" });
    }
    const fileName = file.filename;
    const filepath = path.join(uploadsDir, fileName);

    try {
      await pipeline(file.file, createWriteStream(`${filepath}`));
    } catch (err) {
      console.error("File upload failed:", err);
      return reply.code(500).send({ message: "Upload failed" });
    }

    const fileData = {
      data_umum_id: Number(body.data_umum_id),
      file_path: filepath,
      file_name: fileName,
      nama_dokumen: body.nama_dokumen,
    };

    const created = await this.dataUmumFileService.createDataUmumFile(fileData);

    return reply.code(201).send(created);
  };

  getFilesByDataUmumId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dataUmumId = Number((request.params as any).dataUmumId);

    const files = await this.dataUmumFileService.getFilesByDataUmumId(
      dataUmumId
    );
    return reply.code(200).send(files);
  };
  deleteDataUmumFile = async (request: FastifyRequest, reply: FastifyReply) => {
    const id = Number((request.params as any).id);
    await this.dataUmumFileService.deleteDataUmumFile(id);
    return reply.code(204).send();
  };

  //show files by id
  showFileById = async (request: FastifyRequest, reply: FastifyReply) => {
    const id = Number((request.params as any).id);
    const fileRecord = await this.dataUmumFileService.getFilesByDataUmumId(id);
    if (!fileRecord || fileRecord.length === 0) {
      return reply.code(404).send({ message: "File not found" });
    }
    const filePath = fileRecord[0].file_path;

    const stream = createReadStream(filePath);
    return reply.type("application/octet-stream").send(stream);
  };
}
