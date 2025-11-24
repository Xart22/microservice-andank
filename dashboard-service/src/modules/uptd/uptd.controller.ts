import { FastifyReply, FastifyRequest } from "fastify";

import { UptdService } from "./uptd.service.js";

export class UptdController {
  uptdService: UptdService;
  constructor(uptdService: UptdService) {
    this.uptdService = uptdService;
  }
  getAllUptd = async (req: FastifyRequest, reply: FastifyReply) => {
    const uptd = await this.uptdService.getAllUptd();
    return reply.send(uptd);
  };

  getUptdById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const uptd = await this.uptdService.getUptdById(Number(id));
    return reply.send(uptd);
  };

  createUptd = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as {
      name: string;
      alamat: string;
      kontak: string;
    };
    const newUptd = await this.uptdService.createUptd(payload);
    return reply.code(201).send(newUptd);
  };

  deleteUptdById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.uptdService.deleteUptdById(Number(id));
    return reply.code(204).send();
  };

  updateUptdById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      name?: string;
      alamat?: string;
    };
    const updatedUptd = await this.uptdService.updateUptdById(
      Number(id),
      payload
    );
    return reply.send(updatedUptd);
  };
}
