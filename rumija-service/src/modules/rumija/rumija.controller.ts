import { FastifyReply, FastifyRequest } from "fastify";

import { RumijaService } from "./rumija.service.js";
import { RumijaUncheckedCreateInput } from "../../generated/prisma/models.js";

export class RumijaController {
  rumijaService: RumijaService;
  constructor(rumijaService: RumijaService) {
    this.rumijaService = rumijaService;
  }

  getAllRumija = async (req: FastifyRequest, reply: FastifyReply) => {
    const rumija = await this.rumijaService.getAllRumija();
    return reply.send(rumija);
  };

  getRumijaById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const rumija = await this.rumijaService.getRumijaById(Number(id));
    return reply.send(rumija);
  };

  createRumija = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as RumijaUncheckedCreateInput;
    const newRumija = await this.rumijaService.createRumija(payload);
    return reply.code(201).send(newRumija);
  };

  deleteRumijaById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.rumijaService.deleteRumijaById(Number(id));
    return reply.code(204).send();
  };

  updateRumijaById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      nomor_rumija?: string;
      rumija_type_id?: number;
      rumija_kelas_id?: number;
      tanggal_terbit?: string;
      tanggal_expired?: string;
      foto?: string;
      video?: string;
    };
    const updatedRumija = await this.rumijaService.updateRumijaById(
      Number(id),
      payload
    );
    return reply.send(updatedRumija);
  };
}
