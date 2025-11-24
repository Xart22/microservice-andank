import { FastifyInstance } from "fastify";

import { DataUmumFileController } from "../modules/data-umum-file/data-umum-file.controller";
import { DataUmumFileService } from "../modules/data-umum-file/data-umum-file.service";

export default async function dataUmumFileRoutes(fastify: FastifyInstance) {
  const service = new DataUmumFileService(fastify.prisma);
  const controller = new DataUmumFileController(service);

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    controller.createDataUmumFile
  );

  fastify.get(
    "/data-umum/:dataUmumId",
    {
      preHandler: [fastify.authenticate],
    },
    controller.getFilesByDataUmumId
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.deleteDataUmumFile
  );

  fastify.get(
    "/file/:id",
    {
      preHandler: [fastify.authenticate],
    },
    controller.showFileById
  );
}
