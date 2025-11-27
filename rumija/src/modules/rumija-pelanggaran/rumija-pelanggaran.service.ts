import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class RumijaPelanggaranService {
  constructor(private prisma: PrismaClient) {}
  //get all rumija pelanggaran
  async getAllRumijaPelanggaran() {
    return this.prisma.rumijaPelangaran.findMany();
  }

  //get rumija pelanggaran by id
  async getRumijaPelanggaranById(id: number) {
    return this.prisma.rumijaPelangaran.findUnique({
      where: { id: id },
    });
  }
  //create new rumija pelanggaran
  async createRumijaPelanggaran(
    data: Prisma.RumijaPelangaranUncheckedCreateInput
  ) {
    return this.prisma.rumijaPelangaran.create({
      data,
    });
  }
  //delete rumija pelanggaran by id
  async deleteRumijaPelanggaranById(id: number) {
    return this.prisma.rumijaPelangaran.delete({
      where: { id: id },
    });
  }
  //update rumija pelanggaran by id
  async updateRumijaPelanggaranById(id: number, data: any) {
    return this.prisma.rumijaPelangaran.update({
      where: { id: id },
      data,
    });
  }
}
