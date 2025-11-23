import { FastifyInstance } from "fastify";

import { KegiatanRutinController } from "../modules/kegiatan-rutin/kegiatan-rutin.controller";
import { KegiatanRutinService } from "../modules/kegiatan-rutin/kegiatan-rutin.service";

export async function kegiatanRutinRoutes(fastify: FastifyInstance) {
  const kegiatanRutinService = new KegiatanRutinService(fastify.prisma);
  const kegiatanRutinController = new KegiatanRutinController(
    kegiatanRutinService
  );
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    kegiatanRutinController.getAllKegiatanRutin
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    kegiatanRutinController.getKegiatanRutinById
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    kegiatanRutinController.createKegiatanRutin
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    kegiatanRutinController.updateKegiatanRutin
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    kegiatanRutinController.deleteKegiatanRutin
  );
}
