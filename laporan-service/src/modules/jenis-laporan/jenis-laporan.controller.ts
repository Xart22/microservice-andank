import { FastifyReply, FastifyRequest } from "fastify";

import { JenisLaporanService } from "./jenis-laporan.service";
export class JenisLaporanController {
  jenisLaporanService: JenisLaporanService;
  constructor(jenisLaporanService: JenisLaporanService) {
    this.jenisLaporanService = jenisLaporanService;
  }
  getAllJenisLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const jenisLaporan = await this.jenisLaporanService.getAllJenisLaporan();
    return reply.send(jenisLaporan);
  };

  getJenisLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const jenisLaporan = await this.jenisLaporanService.getJenisLaporanById(
      Number(id)
    );
    return reply.send(jenisLaporan);
  };

  createJenisLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as {
      nama_jenis: string;
    };
    const newJenisLaporan = await this.jenisLaporanService.createJenisLaporan(
      payload
    );
    return reply.code(201).send(newJenisLaporan);
  };

  deleteJenisLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.jenisLaporanService.deleteJenisLaporanById(Number(id));
    return reply.code(204).send();
  };

  updateJenisLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      nama_jenis?: string;
      deskripsi?: string;
    };
    const updatedJenisLaporan =
      await this.jenisLaporanService.updateJenisLaporanById(
        Number(id),
        payload
      );
    return reply.send(updatedJenisLaporan);
  };
}
