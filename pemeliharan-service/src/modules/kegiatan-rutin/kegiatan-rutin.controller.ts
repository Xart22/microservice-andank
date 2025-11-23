import { FastifyReply, FastifyRequest } from "fastify";
import { KegiatanRutinService } from "./kegiatan-rutin.service";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import path from "path";
import { uploadsDir, uploadsKegiatanRutinDir } from "../../helper/utils";

export class KegiatanRutinController {
  constructor(private kegiatanRutinService: KegiatanRutinService) {}
  getAllKegiatanRutin = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const kegiatanRutinList =
      await this.kegiatanRutinService.getAllKegiatanRutin();
    return reply.send(kegiatanRutinList);
  };

  getKegiatanRutinById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: number };
    const kegiatanRutin = await this.kegiatanRutinService.getKegiatanRutinById(
      id
    );
    return reply.send(kegiatanRutin);
  };

  createKegiatanRutin = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const body: any = request.body;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ message: "Body must be object" });
    }

    // file dari multipart
    const file0 = body.image_0; // contoh field name: image
    const file50 = body.image_50; // contoh field name: image
    const file100 = body.image_100; // contoh field name: image

    if (!file0 || !file0.file) {
      return reply.code(400).send({ message: "Image file is required" });
    }

    // path upload
    const fileName0 = file0.filename;
    const filepath0 = path.join(uploadsKegiatanRutinDir, fileName0);
    const fileName50 = file50?.filename;
    const filepath50 = fileName50
      ? path.join(uploadsKegiatanRutinDir, fileName50)
      : undefined;
    const fileName100 = file100?.filename;
    const filepath100 = fileName100
      ? path.join(uploadsKegiatanRutinDir, fileName100)
      : undefined;

    try {
      await pipeline(file0.file, createWriteStream(`${filepath0}`));
      if (file50 && file50.file) {
        await pipeline(file50.file, createWriteStream(`${filepath50}`));
      }
      if (file100 && file100.file) {
        await pipeline(file100.file, createWriteStream(`${filepath100}`));
      }
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
      jenis_kegiatan: String(body.jenis_kegiatan.value),
      deskripsi: String(body.deskripsi.value),
      ruas_jalan_id: Number(body.ruas_jalan_id.value),
      sup_id: Number(body.sup_id.value),
      uptd_id: Number(body.uptd_id.value),
      kota_id: Number(body.kota_id.value),
      lokasi_km: String(body.lokasi_km.value),
      lokasi_m: String(body.lokasi_m.value),
      image_0: filepath0,
      image_50: filepath50,
      image_100: filepath100,
      created_by: request.user.sub,
    };

    const newKegiatanRutin =
      await this.kegiatanRutinService.createKegiatanRutin(payload);
    return reply.send(newKegiatanRutin);
  };

  updateKegiatanRutin = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: number };
    const data = request.body as any;
    const updatedKegiatanRutin =
      await this.kegiatanRutinService.updateKegiatanRutin(id, data);
    return reply.send(updatedKegiatanRutin);
  };

  deleteKegiatanRutin = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: number };
    const deletedKegiatanRutin =
      await this.kegiatanRutinService.deleteKegiatanRutin(id);
    return reply.send(deletedKegiatanRutin);
  };
}
