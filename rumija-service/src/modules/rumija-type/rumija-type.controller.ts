import { FastifyReply, FastifyRequest } from "fastify";

import { RumijaTypeService } from "./rumija-type.service.js";
import { Prisma } from "../../generated/prisma/client.js";

export class RumijaTypeController {
  rumijaTypeService: RumijaTypeService;
  constructor(rumijaTypeService: RumijaTypeService) {
    this.rumijaTypeService = rumijaTypeService;
  }
  getAllRumijaType = async (req: FastifyRequest, reply: FastifyReply) => {
    const rumijaType = await this.rumijaTypeService.getAllRumijaType();
    return reply.send(rumijaType);
  };
  getRumijaTypeById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const rumijaType = await this.rumijaTypeService.getRumijaTypeById(
      Number(id),
    );
    return reply.send(rumijaType);
  };

  createRumijaType = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as Prisma.RumijaTypeUncheckedCreateInput;
    const newRumijaType =
      await this.rumijaTypeService.createRumijaType(payload);
    return reply.code(201).send(newRumijaType);
  };
  deleteRumijaTypeById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.rumijaTypeService.deleteRumijaTypeById(Number(id));
    return reply.code(204).send();
  };

  updateRumijaTypeById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      nama_type?: string;
      deskripsi?: string;
    };
    const updatedRumijaType = await this.rumijaTypeService.updateRumijaTypeById(
      Number(id),
      payload,
    );
    return reply.send(updatedRumijaType);
  };
}
