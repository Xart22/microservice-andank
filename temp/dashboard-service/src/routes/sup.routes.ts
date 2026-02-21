import { FastifyInstance } from "fastify";
import { SupController } from "../modules/sup/sup.controller.js";
import { SupService } from "../modules/sup/sup.service.js";

export async function supRoutes(fastify: FastifyInstance) {
  const supService = new SupService(fastify.prisma);
  const supController = new SupController(supService);
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    supController.getAllSup
  );
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    supController.getSupById
  );
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    supController.createSup
  );
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    supController.deleteSupById
  );
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    supController.updateSupById
  );
}
