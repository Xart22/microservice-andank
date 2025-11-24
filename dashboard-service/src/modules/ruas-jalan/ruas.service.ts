import { PrismaClient } from "../../generated/prisma/client.js";

export class RuasService {
  constructor(private prisma: PrismaClient) {}

  //get all ruas jalan
  async getAllRuas() {
    return this.prisma.ruasJalan.findMany({
      include: {
        uptd: true,
        sup: true,
      },
    });
  }
  //create new ruas jalan
  async createRuas(data: {
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
  }) {
    return this.prisma.ruasJalan.create({
      data,
    });
  }
  //get ruas jalan by id
  async getRuasById(id: string) {
    return this.prisma.ruasJalan.findUnique({
      where: { id_ruas_jalan: id },
      include: {
        uptd: true,
        sup: true,
      },
    });
  }
  //delete ruas jalan by id
  async deleteRuasById(id: string) {
    return this.prisma.ruasJalan.delete({
      where: { id_ruas_jalan: id },
    });
  }
  //update ruas jalan by id
  async updateRuasById(
    id: string,
    data: {
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
    }
  ) {
    return this.prisma.ruasJalan.update({
      where: { id_ruas_jalan: id },
      data,
    });
  }

  //get ruas jalan by uptd id
  async getRuasByUptdId(uptd_id: number) {
    return this.prisma.ruasJalan.findMany({
      where: { uptd_id },
      include: {
        uptd: true,
        sup: true,
      },
    });
  }

  //get ruas jalan by sup id
  async getRuasBySupId(sup_id: number) {
    return this.prisma.ruasJalan.findMany({
      where: { sup_id },
      include: {
        uptd: true,
        sup: true,
      },
    });
  }
}
