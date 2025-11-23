import { FastifyReply, FastifyRequest } from "fastify";
import { JadualService } from "./jadual.service";
import { Prisma } from "../../../generated/prisma/client";
import { CreateJadualBody } from "../../types/jadual";

export class JadualController {
  constructor(private jadualService: JadualService) {}

  createJadual = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as CreateJadualBody;

    const {
      data_umum_detail_id,
      nmp,
      uraian_pekerjaan,
      total_harga,
      total_volume,
      satuan,
      bobot,
      koefisien,
      jadualDetails,
    } = body;

    // --- Header (Jadual) ---
    const headerData: Prisma.JadualUncheckedCreateInput = {
      data_umum_detail_id,
      nmp,
      uraian_pekerjaan,
      total_harga,
      total_volume,
      satuan,
      bobot,
      koefisien,
      // created_at & updated_at otomatis
    };

    // --- Detail (JadualDetail[]) ---
    const detailsData: Omit<
      Prisma.JadualDetailUncheckedCreateInput,
      "jadual_id"
    >[] = jadualDetails.map((d) => ({
      uraian_pekerjaan: d.uraian_pekerjaan,
      volume: d.volume,
      satuan: d.satuan,
      harga_satuan: d.harga_satuan,
      total_harga: d.total_harga,
      tanggal: new Date(d.tanggal),
      nilai: d.nilai,
      // created_at, updated_at auto
    }));

    const created = await this.jadualService.createJadual(
      headerData,
      detailsData
    );

    return reply.code(201).send(created);
  };

  getJadualById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const jadual = await this.jadualService.getJadualById(Number(id));

    if (!jadual) {
      return reply.code(404).send({ message: "Jadual not found" });
    }

    return reply.send(jadual);
  };

  getJadualByDataUmumDetailId = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { data_umum_detail_id } = request.params as {
      data_umum_detail_id: string;
    };
    const list = await this.jadualService.getJadualByDataUmumDetailId(
      Number(data_umum_detail_id)
    );

    return reply.send(list);
  };

  updateJadual = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const body = request.body as CreateJadualBody;
    const {
      data_umum_detail_id,
      nmp,
      uraian_pekerjaan,
      total_harga,
      total_volume,
      satuan,
      bobot,
      koefisien,
      jadualDetails,
    } = body;

    // --- Header (Jadual) ---
    const headerData: Prisma.JadualUncheckedUpdateInput = {
      data_umum_detail_id,
      nmp,
      uraian_pekerjaan,
      total_harga,
      total_volume,
      satuan,
      bobot,
      koefisien,
      // created_at & updated_at otomatis
    };
    // --- Detail (JadualDetail[]) ---
    const detailsData: Omit<
      Prisma.JadualDetailUncheckedCreateInput,
      "jadual_id"
    >[] = jadualDetails.map((d) => ({
      uraian_pekerjaan: d.uraian_pekerjaan,
      volume: d.volume,
      satuan: d.satuan,
      harga_satuan: d.harga_satuan,
      total_harga: d.total_harga,
      tanggal: new Date(d.tanggal),
      nilai: d.nilai,
      // created_at, updated_at auto
    }));
    const updated = await this.jadualService.updateJadual(
      Number(id),
      headerData,
      detailsData
    );
    return reply.send(updated);
  };
}
