import { FastifyReply, FastifyRequest } from "fastify";
import { DataUmumService } from "./data-umum.service";
import { Prisma } from "../../../generated/prisma/client";
import { CreateDataUmumBody } from "../../types/dataUmum";

export class DataUmumController {
  constructor(private dataUmumService: DataUmumService) {}

  getDataUmum = async (request: FastifyRequest, reply: FastifyReply) => {
    const dataUmumId = await this.dataUmumService.getAllDataUmum();
    return reply.code(200).send(dataUmumId);
  };

  createDataUmum = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as CreateDataUmumBody;

    const { dataUmumDetail, dataUmumRuas, ...headerFields } = body;

    // --- Header (DataUmum) ---
    const headerData: Prisma.DataUmumUncheckedCreateInput = {
      pemda: headerFields.pemda,
      opd: headerFields.opd,
      nm_paket: headerFields.nm_paket,
      no_kontrak: headerFields.no_kontrak,
      tgl_kontrak: new Date(headerFields.tgl_kontrak),
      no_spmk: headerFields.no_spmk,
      tgl_spmk: new Date(headerFields.tgl_spmk),
      kategori_paket: headerFields.kategori_paket,
      uptd_id: headerFields.uptd_id,
      ppk_kegiatan: headerFields.ppk_kegiatan,
      thn: headerFields.thn,
    };

    // --- Detail (DataUmumDetail) ---
    const detailData: Omit<
      Prisma.DataUmumDetailUncheckedCreateInput,
      "data_umum_id"
    > = {
      tgl_adendum: dataUmumDetail.tgl_adendum
        ? new Date(dataUmumDetail.tgl_adendum)
        : null,
      nilai_kontrak: dataUmumDetail.nilai_kontrak.toString(),
      panjang_km: Number(dataUmumDetail.panjang_km),
      lama_waktu: Number(dataUmumDetail.lama_waktu),
      kontraktor_id: dataUmumDetail.kontraktor_id,
      konsultan_id: dataUmumDetail.konsultan_id,
      ppk_id: dataUmumDetail.ppk_id,
      is_active: true,
      keterangan: dataUmumDetail.keterangan ?? null,
      created_at: undefined as any,
      updated_at: undefined as any,
    };

    delete (detailData as any).created_at;
    delete (detailData as any).updated_at;

    // --- Ruas (DataUmumRuas[]) ---
    const ruasData: Omit<
      Prisma.DataUmumRuasUncheckedCreateInput,
      "data_umum_detail_id"
    >[] = dataUmumRuas.map((r) => ({
      ruas_id: r.ruas_id,
      segment_jalan: r.segment_jalan,
      lat_awal: r.lat_awal,
      long_awal: r.long_awal,
      lat_akhir: r.lat_akhir,
      long_akhir: r.long_akhir,
      created_at: undefined as any,
      updated_at: undefined as any,
    }));

    ruasData.forEach((r) => {
      delete (r as any).created_at;
      delete (r as any).updated_at;
    });

    const created = await this.dataUmumService.createDataUmum(
      headerData,
      detailData,
      ruasData
    );

    return reply.code(201).send(created);
  };

  getDataUmumByAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    const user_id = request.user.uptd_id as number;
    const dataUmum = await this.dataUmumService.getDataUmumByAuth(user_id);
    return reply.code(200).send(dataUmum);
  };

  createAdendumDataUmum = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const dataUmumId = Number((request.params as any).id);
    const body = request.body as CreateDataUmumBody;

    const { dataUmumDetail, dataUmumRuas, ...headerFields } = body;
    const detailData: Omit<
      Prisma.DataUmumDetailUncheckedCreateInput,
      "data_umum_id"
    > = {
      tgl_adendum: dataUmumDetail.tgl_adendum
        ? new Date(dataUmumDetail.tgl_adendum)
        : null,
      nilai_kontrak: dataUmumDetail.nilai_kontrak.toString(),
      panjang_km: Number(dataUmumDetail.panjang_km),
      lama_waktu: Number(dataUmumDetail.lama_waktu),
      kontraktor_id: dataUmumDetail.kontraktor_id,
      konsultan_id: dataUmumDetail.konsultan_id,
      ppk_id: dataUmumDetail.ppk_id,
      is_active: true,
      keterangan: dataUmumDetail.keterangan ?? null,
      created_at: undefined as any,
      updated_at: undefined as any,
    };
    delete (detailData as any).created_at;
    delete (detailData as any).updated_at;

    // --- Ruas (DataUmumRuas[]) ---
    const ruasData: Omit<
      Prisma.DataUmumRuasUncheckedCreateInput,
      "data_umum_detail_id"
    >[] = dataUmumRuas.map((r) => ({
      ruas_id: r.ruas_id,
      segment_jalan: r.segment_jalan,
      lat_awal: r.lat_awal,
      long_awal: r.long_awal,
      lat_akhir: r.lat_akhir,
      long_akhir: r.long_akhir,
      created_at: undefined as any,
      updated_at: undefined as any,
    }));

    ruasData.forEach((r) => {
      delete (r as any).created_at;
      delete (r as any).updated_at;
    });

    const createdAdendum = await this.dataUmumService.createAdendum(
      dataUmumId,
      detailData,
      ruasData
    );
    return reply.code(201).send(createdAdendum);
  };

  updateDataUmum = async (request: FastifyRequest, reply: FastifyReply) => {
    const dataUmumId = Number((request.params as any).id);
    const body = request.body as CreateDataUmumBody;

    const { dataUmumDetail, dataUmumRuas, ...headerFields } = body;
    const detailData: Omit<
      Prisma.DataUmumDetailUncheckedCreateInput,
      "data_umum_id"
    > = {
      tgl_adendum: dataUmumDetail.tgl_adendum
        ? new Date(dataUmumDetail.tgl_adendum)
        : null,
      nilai_kontrak: dataUmumDetail.nilai_kontrak.toString(),
      panjang_km: Number(dataUmumDetail.panjang_km),
      lama_waktu: Number(dataUmumDetail.lama_waktu),
      kontraktor_id: dataUmumDetail.kontraktor_id,
      konsultan_id: dataUmumDetail.konsultan_id,
      ppk_id: dataUmumDetail.ppk_id,
      is_active: true,
      keterangan: dataUmumDetail.keterangan ?? null,
      created_at: undefined as any,
      updated_at: undefined as any,
    };
    delete (detailData as any).created_at;
    delete (detailData as any).updated_at;

    // --- Ruas (DataUmumRuas[]) ---
    const ruasData: Omit<
      Prisma.DataUmumRuasUncheckedCreateInput,
      "data_umum_detail_id"
    >[] = dataUmumRuas.map((r) => ({
      ruas_id: r.ruas_id,
      segment_jalan: r.segment_jalan,
      lat_awal: r.lat_awal,
      long_awal: r.long_awal,
      lat_akhir: r.lat_akhir,
      long_akhir: r.long_akhir,
      created_at: undefined as any,
      updated_at: undefined as any,
    }));

    ruasData.forEach((r) => {
      delete (r as any).created_at;
      delete (r as any).updated_at;
    });

    const updated = await this.dataUmumService.updateDataUmum(
      dataUmumId,
      headerFields,
      detailData,
      ruasData
    );
    return reply.code(200).send(updated);
  };
}
