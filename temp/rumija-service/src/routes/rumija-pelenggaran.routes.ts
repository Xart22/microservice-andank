import { FastifyInstance } from "fastify";

import { RumijaPelanggaranController } from "../modules/rumija-pelanggaran/rumija-pelanggaran.controller.js";
import { RumijaPelanggaranService } from "../modules/rumija-pelanggaran/rumija-pelanggaran.service.js";

export async function rumijaPelanggaranRoutes(fastify: FastifyInstance) {
  const rumijaPelanggaranService = new RumijaPelanggaranService(fastify.prisma);
  const rumijaPelanggaranController = new RumijaPelanggaranController(
    rumijaPelanggaranService
  );

  fastify.get("/", rumijaPelanggaranController.getAllRumijaPelanggaran);

  fastify.get("/:id", rumijaPelanggaranController.getRumijaPelanggaranById);

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaPelanggaranController.createRumijaPelanggaran
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaPelanggaranController.deleteRumijaPelanggaranById
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaPelanggaranController.updateRumijaPelanggaranById
  );
}
