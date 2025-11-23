import { FastifyReply, FastifyRequest } from "fastify";
import { DataUmumService } from "./data-umum.service";

import {
  DataUmumDetailCreateInput,
  DataUmumDetailUncheckedCreateInput,
  DataUmumRuasCreateInput,
  DataUmumRuasUncheckedCreateInput,
  DataUmumUncheckedCreateInput,
  DataUmumUncheckedUpdateInput,
} from "../../../generated/prisma/models";
import { DataUmumRuas } from "../../../generated/prisma/client";
import { CreateDataUmumBody } from "../../types/dataUmum";

export class DataUmumController {
  constructor(private dataUmumService: DataUmumService) {}

  getDataUmum = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.dataUmumService.getDataUmum();
    reply.send(data);
  };

  getDataUmumById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const data = await this.dataUmumService.getDataUmumById(id);
    reply.send(data);
  };

  createDataUmum = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as CreateDataUmumBody;

    const { dataUmumDetail, dataUmumRuas, ...header } = body;

    // convert tanggal (kalau di Prisma field-nya DateTime)
    const tglKontrak = new Date(header.tgl_kontrak);
    const tglSpmk = new Date(header.tgl_spmk);
    const lamaWaktu = Number(dataUmumDetail.lama_waktu);

    // siapkan data untuk header (DataUmum)
    const dataUmumData: DataUmumUncheckedCreateInput = {
      pemda: header.pemda,
      opd: header.opd,
      nm_paket: header.nm_paket,
      no_kontrak: header.no_kontrak,
      tgl_kontrak: tglKontrak,
      no_spmk: header.no_spmk,
      tgl_spmk: tglSpmk,
      kategori_paket: header.kategori_paket,
      uptd_id: header.uptd_id,
      ppk_kegiatan: header.ppk_kegiatan,
      thn: header.thn,
      // kalau ada field lain di model DataUmum, tambahkan di sini
    };

    // detail (anggap di Prisma field-nya nilai_kontrak: Decimal/BigInt/Int)
    const dataUmumDetailData: DataUmumDetailUncheckedCreateInput[] = [
      {
        nilai_kontrak: dataUmumDetail.nilai_kontrak,
        panjang_km: dataUmumDetail.panjang_km,
        lama_waktu: lamaWaktu,
        kontraktor_id: dataUmumDetail.kontraktor_id,
        konsultan_id: dataUmumDetail.konsultan_id,
        ppk_id: dataUmumDetail.ppk_id,
        data_umum_id: "",
      },
    ];

    // ruas
    const dataUmumRuasData: DataUmumRuasUncheckedCreateInput[] =
      body.dataUmumRuas.map((ruas) => ({
        ruas_id: ruas.ruas_id,
        segment_jalan: ruas.segment_jalan,
        lat_awal: ruas.lat_awal,
        long_awal: ruas.long_awal,
        lat_akhir: ruas.lat_akhir,
        long_akhir: ruas.long_akhir,
        data_umum_detail_id: 0,
      }));

    const created = await this.dataUmumService.createDataUmum(
      dataUmumData,
      dataUmumDetailData,
      dataUmumRuasData
    );

    return reply.code(201).send(created);
  };

  updateDataUmum = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: DataUmumUncheckedUpdateInput;
    }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const data = request.body;
    const updatedData = await this.dataUmumService.updateDataUmum(id, data);
    reply.send(updatedData);
  };

  deleteDataUmum = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const deletedData = await this.dataUmumService.deleteDataUmum(id);
    reply.send(deletedData);
  };
}
