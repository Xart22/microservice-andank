import { FastifyInstance } from "fastify";

import { UptdController } from "../modules/uptd/uptd.controller";
import { UptdService } from "../modules/uptd/uptd.service";

export async function uptdRoutes(fastify: FastifyInstance) {
  const uptdService = new UptdService(fastify.prisma);
  const uptdController = new UptdController(uptdService);

  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    uptdController.getAllUptd
  );
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    uptdController.getUptdById
  );
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    uptdController.createUptd
  );
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    uptdController.deleteUptdById
  );
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    uptdController.updateUptdById
  );
}
