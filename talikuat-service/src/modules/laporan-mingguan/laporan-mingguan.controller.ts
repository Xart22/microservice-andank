import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/client.js";
import { LaporanMingguanService } from "./laporan-mingguan.service.js";

export class LaporanMingguanController {
  constructor(private laporanMingguanService: LaporanMingguanService) {}

  getLaporanMingguanByDataUmumId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dataUmumId = Number((request.params as any).dataUmumId);
    const laporanMingguan =
      await this.laporanMingguanService.getLaporanMingguanByDataUmumId(
        dataUmumId
      );
    return reply.code(200).send(laporanMingguan);
  };
  createLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const body = request.body as any;
    const createdLaporanMingguan =
      await this.laporanMingguanService.createLaporanMingguan(body);
    return reply.code(201).send(createdLaporanMingguan);
  };
  updateLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dataLaporanMingguanId = Number((request.params as any).id);
    const body = request.body as any;
    const updatedLaporanMingguan =
      await this.laporanMingguanService.updateLaporanMingguan(
        dataLaporanMingguanId,
        body
      );
    return reply.code(200).send(updatedLaporanMingguan);
  };
  deleteLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dataLaporanMingguanId = Number((request.params as any).id);
    await this.laporanMingguanService.deleteLaporanMingguan(
      dataLaporanMingguanId
    );
    return reply.code(204).send();
  };
}
