import { FastifyInstance } from "fastify";

import { DataUmumController } from "../modules/data-umum/data-umum.controller";

import { DataUmumService } from "../modules/data-umum/data-umum.service";
import { createDataUmumSchema } from "../modules/data-umum/data-umum.schema";

export async function dataumRoutes(fastify: FastifyInstance) {
  const dataUmumService = new DataUmumService(fastify.prisma);
  const dataUmumController = new DataUmumController(dataUmumService);

  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    dataUmumController.getDataUmum
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    dataUmumController.getDataUmumById
  );

  fastify.post<{ Body: any }>(
    "/",
    {
      schema: createDataUmumSchema,
      preHandler: [fastify.authenticate],
    },
    dataUmumController.createDataUmum
  );
  fastify.put<{ Params: { id: string }; Body: any }>(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    dataUmumController.updateDataUmum
  );
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    dataUmumController.deleteDataUmum
  );
}
