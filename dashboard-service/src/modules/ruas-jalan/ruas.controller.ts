import { FastifyReply, FastifyRequest } from "fastify";
import { RuasService } from "./ruas.service.js";

export class RuasController {
  ruasService: RuasService;
  constructor(ruasService: RuasService) {
    this.ruasService = ruasService;
  }

  getAllRuas = async (req: FastifyRequest, reply: FastifyReply) => {
    const ruas = await this.ruasService.getAllRuas();
    return reply.send(ruas);
  };

  getRuasById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const ruas = await this.ruasService.getRuasById(id);
    return reply.send(ruas);
  };

  createRuas = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as {
      id_ruas_jalan: string;
      nama_ruas_jalan: string;
      panjang_km: number;
      sta_awal: string;
      sta_akhir: string;
      lat_awal: number;
      long_awal: number;
      lat_akhir: number;
      long_akhir: number;
      uptd_id: number;
      sup_id: number;
    };
    const newRuas = await this.ruasService.createRuas(payload);
    return reply.code(201).send(newRuas);
  };

  deleteRuasById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.ruasService.deleteRuasById(id);
    return reply.code(204).send();
  };

  updateRuasById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      nama_ruas_jalan?: string;
      panjang_km?: number;
      sta_awal?: string;
      sta_akhir?: string;
      lat_awal?: number;
      long_awal?: number;
      lat_akhir?: number;
      long_akhir?: number;
      uptd_id?: number;
      sup_id?: number;
    };
    const updatedRuas = await this.ruasService.updateRuasById(id, payload);
    return reply.send(updatedRuas);
  };

  getRuasByUptdId = async (req: FastifyRequest, reply: FastifyReply) => {
    const { uptd_id } = req.params as { uptd_id: number };
    const ruas = await this.ruasService.getRuasByUptdId(uptd_id);
    return reply.send(ruas);
  };

  getRuasBySupId = async (req: FastifyRequest, reply: FastifyReply) => {
    const { sup_id } = req.params as { sup_id: number };
    const ruas = await this.ruasService.getRuasBySupId(sup_id);
    return reply.send(ruas);
  };
}
