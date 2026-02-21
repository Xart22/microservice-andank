import { FastifyInstance } from "fastify";
import { RumijaKelasController } from "../modules/rumija-kelas/rumija-kelas.controller.js";
import { RumijaKelasService } from "../modules/rumija-kelas/rumija-kelas.service.js";

export async function rumijaKelasRoutes(fastify: FastifyInstance) {
  const rumijaKelasService = new RumijaKelasService(fastify.prisma);
  const rumijaKelasController = new RumijaKelasController(rumijaKelasService);

  fastify.get("/", rumijaKelasController.getAllRumijaKelas);

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaKelasController.getRumijaKelasById
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaKelasController.createRumijaKelas
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaKelasController.deleteRumijaKelasById
  );

  fastify.put(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    rumijaKelasController.updateRumijaKelasById
  );
}
