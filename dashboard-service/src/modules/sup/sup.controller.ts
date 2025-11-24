import { FastifyReply, FastifyRequest } from "fastify";
import { SupService } from "./sup.service.js";

export class SupController {
  supService: SupService;
  constructor(supService: SupService) {
    this.supService = supService;
  }
  getAllSup = async (req: FastifyRequest, reply: FastifyReply) => {
    const sup = await this.supService.getAllSup();
    return reply.send(sup);
  };

  getSupById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const sup = await this.supService.getSupById(Number(id));
    return reply.send(sup);
  };

  createSup = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as {
      name: string;
      uptd_id: number;
    };
    const newSup = await this.supService.createSup(payload);
    return reply.code(201).send(newSup);
  };

  deleteSupById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.supService.deleteSupById(Number(id));
    return reply.code(204).send();
  };

  updateSupById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      name?: string;
      uptd_id?: number;
    };
    const updatedSup = await this.supService.updateSupById(Number(id), payload);
    return reply.send(updatedSup);
  };
}
