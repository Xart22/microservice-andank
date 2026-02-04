import { FastifyReply, FastifyRequest } from "fastify";

import { RumijaService } from "./rumija.service.js";
import { Prisma } from "../../generated/prisma/client.js";

import { createWriteStream } from "node:fs";

import path from "node:path";
import { pipeline } from "stream/promises";
import { uploadsDir } from "../helper/utils.js";

export class RumijaController {
  rumijaService: RumijaService;
  constructor(rumijaService: RumijaService) {
    this.rumijaService = rumijaService;
  }

  getAllRumija = async (req: FastifyRequest, reply: FastifyReply) => {
    const rumija = await this.rumijaService.getAllRumija();
    return reply.send(rumija);
  };

  getRumijaById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const rumija = await this.rumijaService.getRumijaById(Number(id));
    return reply.send(rumija);
  };

  createRumija = async (req: FastifyRequest, reply: FastifyReply) => {
    const body: any = req.body;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ message: "Body must be object" });
    }

    // file dari multipart
    const foto = body.foto; // contoh field name: image
    const video = body.video; // contoh field name: image
    if (!foto || !foto.file) {
      return reply.code(400).send({ message: "Image file is required" });
    }
    if (!video || !video.file) {
      return reply.code(400).send({ message: "Video file is required" });
    }

    if (foto && foto.file) {
      const fotoFileName = Date.now() + foto.filename;
      const filepath = path.join(uploadsDir, fotoFileName);
      try {
        await pipeline(foto.file, createWriteStream(`${filepath}`));
      } catch (err) {
        return reply.code(500).send({ message: "Image upload failed" });
      }
      body.foto = filepath; // assign path image ke body
    }

    if (video && video.file) {
      const videoFileName = Date.now() + video.filename;
      const videoFilepath = path.join(uploadsDir, videoFileName);
      try {
        await pipeline(video.file, createWriteStream(`${videoFilepath}`));
      } catch (err) {
        return reply.code(500).send({ message: "Video upload failed" });
      }
      body.video = videoFilepath; // assign path video ke body
    }

    // assign image path ke data
    const payload: Prisma.RumijaUncheckedCreateInput = {
      no_izin: body.no_izin?.value ?? body.no_izin,
      name: body.name?.value ?? body.name,
      alamat: body.alamat?.value ?? body.alamat,
      luas: Number(body.luas?.value ?? body.luas),
      ruas_id: Number(body.ruas_id?.value ?? body.ruas_id),
      segment_jalan: body.segment_jalan?.value ?? body.segment_jalan,
      lat_awal: Number(body.lat_awal?.value ?? body.lat_awal),
      long_awal: Number(body.long_awal?.value ?? body.long_awal),
      uptd_id: Number(body.uptd_id?.value ?? body.uptd_id),
      uraian: body.uraian?.value ?? body.uraian,
      tanggal_izin: new Date(body.tanggal_izin?.value ?? body.tanggal_izin),
      tanggal_expired: new Date(
        body.tanggal_expired?.value ?? body.tanggal_expired,
      ),
      rumija_type_id: Number(body.rumija_type_id?.value ?? body.rumija_type_id),
      rumija_kelas_id: Number(
        body.rumija_kelas_id?.value ?? body.rumija_kelas_id,
      ),

      foto: body.foto, // string path
      video: body.video, // string path | null
    };
    try {
      const newRumija = await this.rumijaService.createRumija(payload);
      console.log("Created Rumija:", newRumija);
      return reply.code(201).send(newRumija);
    } catch (error) {
      console.error("Error creating Rumija:", error);
      return reply.code(500).send({ message: error });
    }
  };

  deleteRumijaById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.rumijaService.deleteRumijaById(Number(id));
    return reply.code(204).send();
  };

  updateRumijaById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      nomor_rumija?: string;
      rumija_type_id?: number;
      rumija_kelas_id?: number;
      tanggal_terbit?: string;
      tanggal_expired?: string;
      foto?: string;
      video?: string;
    };
    const updatedRumija = await this.rumijaService.updateRumijaById(
      Number(id),
      payload,
    );
    return reply.send(updatedRumija);
  };
}
