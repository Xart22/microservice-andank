import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/client.js";
import { LaporanMingguanService } from "./laporan-mingguan.service.js";

export class LaporanMingguanController {
  constructor(private laporanMingguanService: LaporanMingguanService) {}

  // Get all laporan mingguan
  getAllLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const laporanMingguan =
      await this.laporanMingguanService.getAllLaporanMingguan();
    return reply.code(200).send(laporanMingguan);
  };

  // Get laporan mingguan by ID
  getLaporanMingguanById = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const id = Number((request.params as any).id);
    const laporanMingguan =
      await this.laporanMingguanService.getLaporanMingguanById(id);

    if (!laporanMingguan) {
      return reply.code(404).send({ message: "Laporan Mingguan not found" });
    }

    return reply.code(200).send(laporanMingguan);
  };

  // Get laporan mingguan by data umum ID
  getLaporanMingguanByDataUmumId = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const dataUmumId = Number((request.params as any).dataUmumId);
    const laporanMingguan =
      await this.laporanMingguanService.getLaporanMingguanByDataUmumId(
        dataUmumId,
      );
    return reply.code(200).send(laporanMingguan);
  };

  // Create laporan mingguan
  createLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const body = request.body as Prisma.LaporanMingguanUncheckedCreateInput;

    const createdLaporanMingguan =
      await this.laporanMingguanService.createLaporanMingguan(body);

    return reply.code(201).send(createdLaporanMingguan);
  };

  // Update laporan mingguan
  updateLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const id = Number((request.params as any).id);
    const body = request.body as Prisma.LaporanMingguanUncheckedUpdateInput;

    const updatedLaporanMingguan =
      await this.laporanMingguanService.updateLaporanMingguan(id, body);

    return reply.code(200).send(updatedLaporanMingguan);
  };

  // Delete laporan mingguan
  deleteLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const id = Number((request.params as any).id);

    await this.laporanMingguanService.deleteLaporanMingguan(id);

    return reply.code(204).send();
  };
}
