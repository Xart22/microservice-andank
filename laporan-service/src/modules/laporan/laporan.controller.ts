import { FastifyReply, FastifyRequest } from "fastify";

import { LaporanMasyarakatService } from "./laporan.service.js";

export class LaporanController {
  laporanService: LaporanMasyarakatService;
  constructor(laporanService: LaporanMasyarakatService) {
    this.laporanService = laporanService;
  }
  getAllLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const laporan = await this.laporanService.getAllLaporan();
    return reply.send(laporan);
  };

  getLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const laporan = await this.laporanService.getLaporanById(Number(id));
    return reply.send(laporan);
  };
  createLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as {
      nama: string;
      nik: string;
      alamat: string;
      judul: string;
      isi_laporan: string;
      foto: string;
      ruas_jalan_id: number;
      jenis_laporan_id: number;
      latitude: number;
      longitude: number;
      no_tiket: string;
      no_telp: string;
      email: string;
    };
    console.log(payload);
    const formmatNoTiket = `TIKET-${Date.now()}`;
    payload.no_tiket = formmatNoTiket;

    const newLaporan = await this.laporanService.createLaporan(payload);
    return reply.code(201).send(newLaporan);
  };
  deleteLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.laporanService.deleteLaporanById(Number(id));
    return reply.code(204).send();
  };
  updateLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      status_laporan?: string;
    };
    const updatedLaporan = await this.laporanService.updateLaporanById(
      Number(id),
      payload
    );
    return reply.send(updatedLaporan);
  };

  responseLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      response: string;
      status_laporan: string;
    };
    const updatedLaporan = await this.laporanService.updateLaporanById(
      Number(id),
      payload
    );
    return reply.send(updatedLaporan);
  };

  findLaporanByRuasJalanId = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { ruas_jalan_id } = req.params as { ruas_jalan_id: string };
    const laporan = await this.laporanService.findLaporanByRuasJalanId(
      Number(ruas_jalan_id)
    );
    return reply.send(laporan);
  };
}
