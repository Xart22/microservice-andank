import { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/client.js";
import { LaporanMingguanService } from "./laporan-mingguan.service.js";

import path from "path";
import { uploadsDir } from "../../helper/utils.js";
export class LaporanMingguanController {
  constructor(private laporanMingguanService: LaporanMingguanService) {}

  getLaporanMingguanByDataUmumId = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const dataUmumId = Number((request.params as any).dataUmumId);
    const laporanMingguan =
      await this.laporanMingguanService.getLaporanMingguanByDataUmumId(
        dataUmumId,
      );
    return reply.code(200).send(laporanMingguan);
  };
  createLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    try {
      const body: any = request.body;
      const getFieldValue = (field: any) => {
        if (field && typeof field === "object" && "value" in field) {
          return field.value;
        }
        return field;
      };
      const normalizeString = (value: any) => {
        if (value === null || value === undefined) {
          return value;
        }
        if (typeof value !== "string") {
          return value;
        }
        let result = value.trim();
        if (result.endsWith(",")) {
          result = result.slice(0, -1).trim();
        }
        if (
          (result.startsWith('"') && result.endsWith('"')) ||
          (result.startsWith("'") && result.endsWith("'"))
        ) {
          result = result.slice(1, -1);
        }
        return result;
      };

      const dataUmumIdRaw = normalizeString(getFieldValue(body?.data_umum_id));
      const dataUmumIdParam = (request.params as any).id;
      const dataUmumId = Number(
        dataUmumIdParam ?? (dataUmumIdRaw as string | number | undefined),
      );

      if (!body || typeof body !== "object") {
        return reply.code(400).send({ message: "Body must be object" });
      }
      if (!Number.isFinite(dataUmumId)) {
        return reply.code(400).send({ message: "data_umum_id is required" });
      }
      const file = body.file_laporan_mingguan;
      if (!file || typeof file !== "object" || !("filename" in file)) {
        return reply
          .code(400)
          .send({ message: "file_laporan_mingguan is required" });
      }

      const fileName = file.filename;
      const filepath = path.join(uploadsDir, fileName);

      const laporanMingguanData: Prisma.LaporanMingguanUncheckedCreateInput = {
        rencana_pekerjaan: normalizeString(
          getFieldValue(body.rencana_pekerjaan),
        ),
        realisasi_pekerjaan: normalizeString(
          getFieldValue(body.realisasi_pekerjaan),
        ),
        deviasi: normalizeString(getFieldValue(body.deviasi)),
        keterangan: normalizeString(getFieldValue(body.keterangan)),
        file_laporan: filepath,
        priode: normalizeString(getFieldValue(body.priode)),
        data_umum_id: dataUmumId,
      };

      const createdLaporanMingguan =
        await this.laporanMingguanService.createLaporanMingguan(
          laporanMingguanData,
        );
      return reply.code(201).send(createdLaporanMingguan);
    } catch (error) {
      console.error("Error creating laporan mingguan:", error);
      return reply.code(500).send({
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  };
  updateLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const dataLaporanMingguanId = Number((request.params as any).id);
    const body = request.body as any;
    const updatedLaporanMingguan =
      await this.laporanMingguanService.updateLaporanMingguan(
        dataLaporanMingguanId,
        body,
      );
    return reply.code(200).send(updatedLaporanMingguan);
  };
  deleteLaporanMingguan = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const dataLaporanMingguanId = Number((request.params as any).id);
    await this.laporanMingguanService.deleteLaporanMingguan(
      dataLaporanMingguanId,
    );
    return reply.code(204).send();
  };
}
