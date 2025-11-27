import { FastifyInstance } from "fastify";
import { RumijaController } from "../modules/rumija/rumija.controller.js";
import { RumijaService } from "../modules/rumija/rumija.service.js";

export async function rumijaRoutes(fastify: FastifyInstance) {
  const rumijaService = new RumijaService(fastify.prisma);
  const rumijaController = new RumijaController(rumijaService);
  fastify.get("/", rumijaController.getAllRumija);
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaController.getRumijaById
  );
  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaController.createRumija
  );
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaController.deleteRumijaById
  );
  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaController.updateRumijaById
  );
}
