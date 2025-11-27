import { FastifyReply, FastifyRequest } from "fastify";

import { RumijaPelangaranUncheckedCreateInput } from "../../generated/prisma/models.js";
import { RumijaPelanggaranService } from "./rumija-pelanggaran.service.js";

export class RumijaPelanggaranController {
  rumijaPelanggaranService: RumijaPelanggaranService;
  constructor(rumijaPelanggaranService: RumijaPelanggaranService) {
    this.rumijaPelanggaranService = rumijaPelanggaranService;
  }
  getAllRumijaPelanggaran = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const rumijaPelanggaran =
      await this.rumijaPelanggaranService.getAllRumijaPelanggaran();
    return reply.send(rumijaPelanggaran);
  };
  getRumijaPelanggaranById = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = req.params as { id: string };
    const rumijaPelanggaran =
      await this.rumijaPelanggaranService.getRumijaPelanggaranById(Number(id));
    return reply.send(rumijaPelanggaran);
  };
  createRumijaPelanggaran = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const payload = req.body as RumijaPelangaranUncheckedCreateInput;
    const newRumijaPelanggaran =
      await this.rumijaPelanggaranService.createRumijaPelanggaran(payload);
    return reply.code(201).send(newRumijaPelanggaran);
  };
  deleteRumijaPelanggaranById = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = req.params as { id: string };
    await this.rumijaPelanggaranService.deleteRumijaPelanggaranById(Number(id));
    return reply.code(204).send();
  };
  updateRumijaPelanggaranById = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      foto?: string;
      segment_jalan?: string;
      lat?: number;
      long?: number;
      keterangan?: string;
    };
    const updatedRumijaPelanggaran =
      await this.rumijaPelanggaranService.updateRumijaPelanggaranById(
        Number(id),
        payload
      );
    return reply.send(updatedRumijaPelanggaran);
  };
}
