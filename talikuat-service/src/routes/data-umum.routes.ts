import { FastifyInstance } from "fastify";
import { DataUmumService } from "../modules/data-umum/data-umum.service";
import { DataUmumController } from "../modules/data-umum/data-umum.controller";
import { createDataUmumSchema } from "../modules/data-umum/data-umum.schema";
// import { createDataUmumSchema } from '../modules/data-umum/data-umum.schema';

export default async function dataUmumRoutes(fastify: FastifyInstance) {
  const service = new DataUmumService(fastify.prisma);
  const controller = new DataUmumController(service);

  fastify.post(
    "/",
    {
      schema: createDataUmumSchema,
      preHandler: [fastify.authenticate],
    },
    controller.createDataUmum
  );

  fastify.get(
    "/all",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getDataUmum
  );

  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getDataUmumByAuth
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.updateDataUmum
  );

  fastify.post(
    "/adendum/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.createAdendumDataUmum
  );
}
