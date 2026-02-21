import { FastifyInstance } from "fastify";

import { RumijaInventarisController } from "../modules/rumija-inventaris/rumija-inventaris.controller.js";
import { RumijaInventarisService } from "../modules/rumija-inventaris/rumija-inventaris.service.js";

export async function rumijaInventarisRoutes(fastify: FastifyInstance) {
  const rumijaInventarisService = new RumijaInventarisService(fastify.prisma);
  const rumijaInventarisController = new RumijaInventarisController(
    rumijaInventarisService
  );

  fastify.get("/", rumijaInventarisController.getAllRumijaInventaris);

  fastify.get("/:id", rumijaInventarisController.getRumijaInventarisById);

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaInventarisController.createRumijaInventaris
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaInventarisController.deleteRumijaInventarisById
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaInventarisController.updateRumijaInventarisById
  );
}
