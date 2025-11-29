import { FastifyReply, FastifyRequest } from "fastify";

import { pipeline } from "stream/promises";
import { createWriteStream, createReadStream } from "fs";

import path from "path";
import { SapulobangService } from "./sapulobang.service.js";
import { uploadsDir } from "../../helper/utils.js";

export class SapulobangController {
  constructor(private sapulobangService: SapulobangService) {}

  getAllSapulobang = async (request: FastifyRequest, reply: FastifyReply) => {
    const sapulobangList = await this.sapulobangService.getAllSapulobang();
    return reply.send(sapulobangList);
  };

  getSapulobangById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const sapulobang = await this.sapulobangService.getSapulobangById(id);
    return reply.send(sapulobang);
  };

  createSapulobang = async (request: FastifyRequest, reply: FastifyReply) => {
    const body: any = request.body;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ message: "Body must be object" });
    }

    // file dari multipart
    const file = body.image_survei; // contoh field name: image

    if (!file || !file.file) {
      return reply.code(400).send({ message: "Image file is required" });
    }

    // path upload
    const fileName = file.filename;
    const filepath = path.join(uploadsDir, fileName);

    try {
      await pipeline(file.file, createWriteStream(`${filepath}`));
    } catch (err) {
      console.error("File upload failed:", err);
      return reply.code(500).send({ message: "Upload failed" });
    }

    // assign image path ke data
    const payload = {
      ...Object.fromEntries(
        Object.entries(body)
          .filter(([k, v]: any) => v?.type === "field")
          .map(([k, v]: any) => [k, v.value])
      ),
      jumlah: Number(body.jumlah.value),
      panjang: Number(body.panjang.value),
      lat_survei: Number(body.lat_survei.value),
      long_survei: Number(body.long_survei.value),
      ruas_jalan_id: Number(body.ruas_jalan_id.value),
      sup_id: Number(body.sup_id.value),
      uptd_id: Number(body.uptd_id.value),
      tanggal_survei: new Date(body.tanggal_survei.value),
      image_survei: filepath,
      created_by: request.user.sub,
    };

    const newSapulobang = await this.sapulobangService.createSapulobang(
      payload
    );

    return reply.send(newSapulobang);
  };

  perencanaanSapulobang = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: number };
    const data = request.body as any;
    const updatedSapulobang = await this.sapulobangService.updateSapulobang(
      id,
      data
    );
    return reply.send(updatedSapulobang);
  };

  penangananSapulobang = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: number };
    const body = request.body as any;
    if (!body || typeof body !== "object") {
      return reply.code(400).send({ message: "Body must be object" });
    }

    // file dari multipart
    const file = body.image_penanganan; // contoh field name: image

    if (!file || !file.file) {
      return reply.code(400).send({ message: "Image file is required" });
    }

    // path upload
    const fileName = file.filename;
    const filepath = path.join(uploadsDir, fileName);

    try {
      await pipeline(file.file, createWriteStream(`${filepath}`));
    } catch (err) {
      console.error("File upload failed:", err);
      return reply.code(500).send({ message: "Upload failed" });
    }

    // assign image path ke data
    const payload = {
      ...Object.fromEntries(
        Object.entries(body)
          .filter(([k, v]: any) => v?.type === "field")
          .map(([k, v]: any) => [k, v.value])
      ),
      tanggal_penanganan: new Date(),
      image_penanganan: filepath,
      penanganan_by: request.user.sub,
    };
  };

  updateSapulobang = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const data = request.body as any;
    const updatedSapulobang = await this.sapulobangService.updateSapulobang(
      id,
      data
    );
    return reply.send(updatedSapulobang);
  };

  deleteSapulobang = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: number };
    const deletedSapulobang = await this.sapulobangService.deleteSapulobang(id);
    return reply.send(deletedSapulobang);
  };

  findSapulobangByRuasId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { ruas_jalan_id } = request.params as { ruas_jalan_id: number };
    const sapulobangList = await this.sapulobangService.findSapulobangByRuasId(
      ruas_jalan_id
    );
    return reply.send(sapulobangList);
  };

  findSapulobangBySupId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { sup_id } = request.params as { sup_id: number };
    const sapulobangList = await this.sapulobangService.findSapulobangBySupId(
      sup_id
    );
    return reply.send(sapulobangList);
  };

  findSapulobangByUptdId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { uptd_id } = request.params as { uptd_id: number };
    const sapulobangList = await this.sapulobangService.findSapulobangByUptdId(
      uptd_id
    );
    return reply.send(sapulobangList);
  };

  findSapulobangByUser = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const params = request.params as { user_id?: number };
    const user_id = params.user_id ?? request.user.sub;
    const sapulobangList = await this.sapulobangService.findSapulobangByUserId(
      user_id
    );
    return reply.send(sapulobangList);
  };

  getFileImageSapulobang = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { filename } = request.params as { filename: string };
    const filepath = path.join(uploadsDir, filename);
    const stream = createReadStream(filepath);
    return reply.type("image/jpeg").send(stream);
  };
}
