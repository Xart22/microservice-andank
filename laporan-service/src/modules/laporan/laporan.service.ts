import { PrismaClient, Prisma } from "../../../generated/prisma/client";

export class LaporanMasyarakatService {
  constructor(private prisma: PrismaClient) {}
  //get all laporan
  async getAllLaporan() {
    return this.prisma.laporanMasyarakat.findMany({
      include: { jenis_laporan: true, responLaporans: true },
    });
  }
  //get laporan by id
  async getLaporanById(id: number) {
    return this.prisma.laporanMasyarakat.findUnique({
      where: { id: id },
    });
  }
  //create new laporan
  async createLaporan(data: Prisma.LaporanMasyarakatUncheckedCreateInput) {
    return this.prisma.laporanMasyarakat.create({
      data,
    });
  }
  //delete laporan by id
  async deleteLaporanById(id: number) {
    return this.prisma.laporanMasyarakat.delete({
      where: { id: id },
    });
  }
  //update laporan by id
  async updateLaporanById(id: number, data: any) {
    return this.prisma.laporanMasyarakat.update({
      where: { id: id },
      data,
    });
  }

  async findLaporanByRuasJalanId(ruas_jalan_id: number) {
    return this.prisma.laporanMasyarakat.findMany({
      where: { ruas_jalan_id: ruas_jalan_id },
    });
  }
}
