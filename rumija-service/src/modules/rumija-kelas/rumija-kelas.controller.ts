import { FastifyReply, FastifyRequest } from "fastify";
import { RumijaKelasService } from "./rumija-kelas.service.js";
import { RumijaKelasUncheckedCreateInput } from "../../generated/prisma/models.js";

export class RumijaKelasController {
  rumijaKelasService: RumijaKelasService;
  constructor(rumijaKelasService: RumijaKelasService) {
    this.rumijaKelasService = rumijaKelasService;
  }
  getAllRumijaKelas = async (req: FastifyRequest, reply: FastifyReply) => {
    const rumijaKelas = await this.rumijaKelasService.getAllRumijaKelas();
    return reply.send(rumijaKelas);
  };

  getRumijaKelasById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const rumijaKelas = await this.rumijaKelasService.getRumijaKelasById(
      Number(id)
    );
    return reply.send(rumijaKelas);
  };

  createRumijaKelas = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as RumijaKelasUncheckedCreateInput;
    const newRumijaKelas = await this.rumijaKelasService.createRumijaKelas(
      payload
    );
    return reply.code(201).send(newRumijaKelas);
  };

  deleteRumijaKelasById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.rumijaKelasService.deleteRumijaKelasById(Number(id));
    return reply.code(204).send();
  };

  updateRumijaKelasById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      nama_kelas?: string;
      deskripsi?: string;
    };
    const updatedRumijaKelas =
      await this.rumijaKelasService.updateRumijaKelasById(Number(id), payload);
    return reply.send(updatedRumijaKelas);
  };
}
