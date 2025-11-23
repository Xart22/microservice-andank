import { FastifyReply, FastifyRequest } from "fastify";
import { ResponseLaporanService } from "./response-laporan.service";

export class ResponseLaporanController {
  responseLaporanService: ResponseLaporanService;
  constructor(responseLaporanService: ResponseLaporanService) {
    this.responseLaporanService = responseLaporanService;
  }
  getAllResponseLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const responseLaporan =
      await this.responseLaporanService.getAllResponseLaporan();
    return reply.send(responseLaporan);
  };

  getResponseLaporanById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const responseLaporan =
      await this.responseLaporanService.getResponseLaporanById(Number(id));
    return reply.send(responseLaporan);
  };

  createResponseLaporan = async (req: FastifyRequest, reply: FastifyReply) => {
    const payload = req.body as {
      laporan_id: number;
      respon_text: string;
      responder_id: number;
      tanggapan: string;
    };
    const responder_id = (req.user as any).sub;
    payload.responder_id = responder_id;
    const newResponseLaporan =
      await this.responseLaporanService.createResponseLaporan(payload);
    return reply.send(newResponseLaporan);
  };

  deleteResponseLaporanById = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = req.params as { id: string };
    await this.responseLaporanService.deleteResponseLaporanById(Number(id));
    return reply.code(204).send();
  };

  updateResponseLaporanById = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } = req.params as { id: string };
    const payload = req.body as {
      respon_text?: string;
      responder_id?: number;
    };
    const updatedResponseLaporan =
      await this.responseLaporanService.updateResponseLaporanById(
        Number(id),
        payload
      );
    return reply.send(updatedResponseLaporan);
  };
}
