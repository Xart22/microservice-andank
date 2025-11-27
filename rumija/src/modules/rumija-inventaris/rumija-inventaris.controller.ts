import { FastifyReply, FastifyRequest } from "fastify";

import {
  RumijaInventarisUncheckedCreateInput,
  RumijaPelangaranUncheckedCreateInput,
} from "../../generated/prisma/models.js";
import { RumijaInventarisService } from "./rumija-inventaris.service.js";

export class RumijaInventarisController {
  rumijaInventarisService: RumijaInventarisService;
  constructor(rumijaInventarisService: RumijaInventarisService) {
    this.rumijaInventarisService = rumijaInventarisService;
  }

  getAllRumijaInventaris = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const rumijaInventaris =
      await this.rumijaInventarisService.getAllRumijaInventaris();
    return reply.send(rumijaInventaris);
  };

  getRumijaInventarisById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: string };
    const rumijaInventaris =
      await this.rumijaInventarisService.getRumijaInventarisById(Number(id));
    return reply.send(rumijaInventaris);
  };

  createRumijaInventaris = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const payload = request.body as RumijaInventarisUncheckedCreateInput;
    const newRumijaInventaris =
      await this.rumijaInventarisService.createRumijaInventaris(payload);
    return reply.code(201).send(newRumijaInventaris);
  };

  deleteRumijaInventarisById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: string };
    await this.rumijaInventarisService.deleteRumijaInventarisById(Number(id));
    return reply.code(204).send();
  };

  updateRumijaInventarisById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = request.params as { id: string };
    const payload = request.body as {
      foto?: string;
      segment_jalan?: string;
      lat?: number;
      long?: number;
      keterangan?: string;
    };
    const updatedRumijaInventaris =
      await this.rumijaInventarisService.updateRumijaInventarisById(
        Number(id),
        payload
      );
    return reply.send(updatedRumijaInventaris);
  };
}
