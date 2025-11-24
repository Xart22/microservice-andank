import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class ResponseLaporanService {
  constructor(private prisma: PrismaClient) {}
  //get all response laporan
  async getAllResponseLaporan() {
    return this.prisma.responLaporan.findMany();
  }
  //get response laporan by id
  async getResponseLaporanById(id: number) {
    return this.prisma.responLaporan.findUnique({
      where: { id: id },
    });
  }
  //create new response laporan
  async createResponseLaporan(data: Prisma.ResponLaporanUncheckedCreateInput) {
    return this.prisma.responLaporan.create({
      data,
    });
  }
  //delete response laporan by id
  async deleteResponseLaporanById(id: number) {
    return this.prisma.responLaporan.delete({
      where: { id: id },
    });
  }
  //update response laporan by id
  async updateResponseLaporanById(id: number, data: any) {
    return this.prisma.responLaporan.update({
      where: { id: id },
      data,
    });
  }
}
