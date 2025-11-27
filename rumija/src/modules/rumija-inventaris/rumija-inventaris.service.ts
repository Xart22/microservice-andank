import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class RumijaInventarisService {
  constructor(private prisma: PrismaClient) {}
  //get all rumija pelanggaran
  async getAllRumijaInventaris() {
    return this.prisma.rumijaInventaris.findMany();
  }

  //get rumija pelanggaran by id
  async getRumijaInventarisById(id: number) {
    return this.prisma.rumijaInventaris.findUnique({
      where: { id: id },
    });
  }
  //create new rumija pelanggaran
  async createRumijaInventaris(
    data: Prisma.RumijaInventarisUncheckedCreateInput
  ) {
    return this.prisma.rumijaInventaris.create({
      data,
    });
  }
  //delete rumija pelanggaran by id
  async deleteRumijaInventarisById(id: number) {
    return this.prisma.rumijaInventaris.delete({
      where: { id: id },
    });
  }
  //update rumija pelanggaran by id
  async updateRumijaInventarisById(id: number, data: any) {
    return this.prisma.rumijaInventaris.update({
      where: { id: id },
      data,
    });
  }
}
