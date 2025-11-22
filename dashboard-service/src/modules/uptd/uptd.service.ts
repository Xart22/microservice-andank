import { PrismaClient, Prisma } from "../../../generated/prisma/client";

export class UptdService {
  constructor(private prisma: PrismaClient) {}
  //get all uptd
  async getAllUptd() {
    return this.prisma.uptd.findMany();
  }

  //get uptd by id
  async getUptdById(id: number) {
    return this.prisma.uptd.findUnique({
      where: { id: id },
    });
  }
  //create new uptd
  async createUptd(data: Prisma.UptdUncheckedCreateInput) {
    return this.prisma.uptd.create({
      data,
    });
  }
  //delete uptd by id
  async deleteUptdById(id: number) {
    return this.prisma.uptd.delete({
      where: { id: id },
    });
  }
  //update uptd by id
  async updateUptdById(id: number, data: Prisma.UptdUpdateInput) {
    return this.prisma.uptd.update({
      where: { id: id },
      data,
    });
  }
}
