import { FastifyInstance } from "fastify";

import { ResponseLaporanService } from "../modules/response-laporan/response-laporan.service";
import { ResponseLaporanController } from "../modules/response-laporan/response-laporan.controller";
import { createResponseLaporanSchema } from "../modules/response-laporan/response-laporan.schema";

export async function responseLaporanRoutes(fastify: FastifyInstance) {
  const responseLaporanService = new ResponseLaporanService(fastify.prisma);
  const responseLaporanController = new ResponseLaporanController(
    responseLaporanService
  );

  fastify.get("/", responseLaporanController.getAllResponseLaporan);
  fastify.get("/:id", responseLaporanController.getResponseLaporanById);
  fastify.post(
    "/",
    { schema: createResponseLaporanSchema, preHandler: [fastify.authenticate] },

    responseLaporanController.createResponseLaporan
  );
  fastify.delete("/:id", responseLaporanController.deleteResponseLaporanById);
  fastify.put("/:id", responseLaporanController.updateResponseLaporanById);
}
