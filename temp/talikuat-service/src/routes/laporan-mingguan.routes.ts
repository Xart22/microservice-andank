import { FastifyInstance } from "fastify";
import { LaporanMingguanService } from "../modules/laporan-mingguan/laporan-mingguan.service.js";
import { LaporanMingguanController } from "../modules/laporan-mingguan/laporan-mingguan.controller.js";

export default async function laporanMingguanRoutes(fastify: FastifyInstance) {
  const service = new LaporanMingguanService(fastify.prisma);
  const controller = new LaporanMingguanController(service);

  // Get all laporan mingguan
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getAllLaporanMingguan,
  );

  // Get laporan mingguan by ID
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getLaporanMingguanById,
  );

  // Get laporan mingguan by data umum ID
  fastify.get(
    "/data-umum/:dataUmumId",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getLaporanMingguanByDataUmumId,
  );

  // Create laporan mingguan
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    controller.createLaporanMingguan,
  );

  // Update laporan mingguan
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.updateLaporanMingguan,
  );

  // Delete laporan mingguan
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.deleteLaporanMingguan,
  );
}
