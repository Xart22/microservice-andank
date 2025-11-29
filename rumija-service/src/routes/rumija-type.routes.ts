import { FastifyInstance } from "fastify";
import { RumijaTypeController } from "../modules/rumija-type/rumija-type.controller.js";
import { RumijaTypeService } from "../modules/rumija-type/rumija-type.service.js";

export async function rumijaTypeRoutes(fastify: FastifyInstance) {
  const rumijaTypeService = new RumijaTypeService(fastify.prisma);
  const rumijaTypeController = new RumijaTypeController(rumijaTypeService);
  fastify.get("/", rumijaTypeController.getAllRumijaType);
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaTypeController.getRumijaTypeById
  );
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaTypeController.createRumijaType
  );
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaTypeController.deleteRumijaTypeById
  );
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaTypeController.updateRumijaTypeById
  );
}
