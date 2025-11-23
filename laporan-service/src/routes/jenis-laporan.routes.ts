import { FastifyInstance } from "fastify";
import { JenisLaporanController } from "../modules/jenis-laporan/jenis-laporan.controller";
import { JenisLaporanService } from "../modules/jenis-laporan/jenis-laporan.service";

export async function jenisLaporanRoutes(fastify: FastifyInstance) {
  const jenisLaporanService = new JenisLaporanService(fastify.prisma);
  const jenisLaporanController = new JenisLaporanController(
    jenisLaporanService
  );

  fastify.get("/", jenisLaporanController.getAllJenisLaporan);

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    jenisLaporanController.getJenisLaporanById
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    jenisLaporanController.createJenisLaporan
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    jenisLaporanController.deleteJenisLaporanById
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    jenisLaporanController.updateJenisLaporanById
  );
}
