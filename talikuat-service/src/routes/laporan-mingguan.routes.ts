import { FastifyInstance } from "fastify";
import { LaporanMingguanService } from "../modules/laporan-mingguan/laporan-mingguan.service.js";
import { LaporanMingguanController } from "../modules/laporan-mingguan/laporan-mingguan.controller.js";

export default async function laporanMingguanRoutes(fastify: FastifyInstance) {
  const service = new LaporanMingguanService(fastify.prisma);
  const controller = new LaporanMingguanController(service);

  fastify.get(
    "/data-umum/:dataUmumId",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getLaporanMingguanByDataUmumId,
  );
  fastify.post(
    "/data-umum/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.createLaporanMingguan,
  );
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.updateLaporanMingguan,
  );
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.deleteLaporanMingguan,
  );
}
