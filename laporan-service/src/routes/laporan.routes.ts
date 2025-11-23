import { FastifyInstance } from "fastify";
import { LaporanController } from "../modules/laporan/laporan.controller";
import { LaporanMasyarakatService } from "../modules/laporan/laporan.service";
import { createLaporanSchema } from "../modules/laporan/laporan.schema";

export async function laporanRoutes(fastify: FastifyInstance) {
  const laporanService = new LaporanMasyarakatService(fastify.prisma);
  const laporanController = new LaporanController(laporanService);

  fastify.get("/", laporanController.getAllLaporan);

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    laporanController.getLaporanById
  );

  fastify.post(
    "/",
    {
      schema: createLaporanSchema,
      preHandler: [fastify.authenticate],
    },
    laporanController.createLaporan
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    laporanController.deleteLaporanById
  );

  fastify.put(
    "/:id",
    {
      // schema: createLaporanSchema,
      preHandler: [fastify.authenticate],
    },
    laporanController.updateLaporanById
  );
}
