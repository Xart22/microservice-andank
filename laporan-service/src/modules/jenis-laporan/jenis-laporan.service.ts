import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class JenisLaporanService {
  constructor(private prisma: PrismaClient) {}

  //get all jenis laporan
  async getAllJenisLaporan() {
    return this.prisma.jenisLaporan.findMany();
  }
  //get jenis laporan by id
  async getJenisLaporanById(id: number) {
    return this.prisma.jenisLaporan.findUnique({
      where: { id: id },
    });
  }
  //create new jenis laporan
  async createJenisLaporan(data: Prisma.JenisLaporanUncheckedCreateInput) {
    return this.prisma.jenisLaporan.create({
      data,
    });
  }
  //delete jenis laporan by id
  async deleteJenisLaporanById(id: number) {
    return this.prisma.jenisLaporan.delete({
      where: { id: id },
    });
  }
  //update jenis laporan by id
  async updateJenisLaporanById(id: number, data: any) {
    return this.prisma.jenisLaporan.update({
      where: { id: id },
      data,
    });
  }
}
