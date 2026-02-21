import { FastifyInstance } from "fastify";
import { perencanaanSapulobangSchema } from "../modules/sapulobang/sapulobang.schema.js";
import { SapulobangService } from "../modules/sapulobang/sapulobang.service.js";
import { SapulobangController } from "../modules/sapulobang/sapulubang.controller.js";

export async function sapulobangRoutes(fastify: FastifyInstance) {
  const sapulobangService = new SapulobangService(fastify.prisma);
  const sapulobangController = new SapulobangController(sapulobangService);

  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },

    sapulobangController.findSapulobangByUser
  );

  fastify.get(
    "/all",
    {
      preHandler: [fastify.authenticate],
    },

    sapulobangController.getAllSapulobang
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.getSapulobangById
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.createSapulobang
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.deleteSapulobang
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.updateSapulobang
  );

  fastify.get(
    "/ruas/:ruas_jalan_id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.findSapulobangByRuasId
  );

  fastify.get(
    "/sup/:sup_id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.findSapulobangBySupId
  );

  fastify.get(
    "/uptd/:uptd_id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.findSapulobangByUptdId
  );

  fastify.get(
    "/user/:user_id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.findSapulobangByUser
  );

  fastify.post(
    "/penanganan/:id",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.penangananSapulobang
  );

  fastify.post(
    "/perencanaan/:id",
    {
      schema: perencanaanSapulobangSchema,
      preHandler: [fastify.authenticate],
    },
    sapulobangController.perencanaanSapulobang
  );

  //get file Image
  fastify.get(
    "/file/:filename",
    {
      preHandler: [fastify.authenticate],
    },
    sapulobangController.getFileImageSapulobang
  );
}
