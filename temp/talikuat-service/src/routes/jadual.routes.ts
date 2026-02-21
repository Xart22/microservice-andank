import { FastifyInstance } from "fastify";
import { JadualService } from "../modules/jadual/jadual.service.js";
import { JadualController } from "../modules/jadual/jadual.controller.js";
import { createJadualSchema } from "../modules/jadual/jadual.schecma.js";

export default async function jadualRoutes(fastify: FastifyInstance) {
  const service = new JadualService(fastify.prisma);
  const controller = new JadualController(service);

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getJadualById
  );
  fastify.get(
    "/data-umum-detail/:dataUmumDetailId",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getJadualByDataUmumDetailId
  );

  fastify.post(
    "/",
    {
      schema: createJadualSchema,
      preHandler: [fastify.authenticate],
    },
    controller.createJadual
  );
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.updateJadual
  );
}
