import { FastifyInstance } from "fastify";
import { RuasController } from "../modules/ruas-jalan/ruas.controller.js";
import { RuasService } from "../modules/ruas-jalan/ruas.service.js";
import { createRuasSchema } from "../modules/ruas-jalan/ruas.schema.js";

export async function ruasRoutes(fastify: FastifyInstance) {
  const ruasService = new RuasService(fastify.prisma);
  const ruasController = new RuasController(ruasService);

  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    ruasController.getAllRuas
  );
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    ruasController.getRuasById
  );
  fastify.post(
    "/",
    {
      schema: createRuasSchema,
      preHandler: [fastify.authenticate],
    },
    ruasController.createRuas
  );
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    ruasController.deleteRuasById
  );
  fastify.put(
    "/:id",
    {
      schema: createRuasSchema,
      preHandler: [fastify.authenticate],
    },
    ruasController.updateRuasById
  );
}
