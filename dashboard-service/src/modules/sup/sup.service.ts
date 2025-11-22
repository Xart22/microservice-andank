import { PrismaClient, Prisma } from "../../../generated/prisma/client";

export class SupService {
  constructor(private prisma: PrismaClient) {}

  //get all sup
  async getAllSup() {
    return this.prisma.sup.findMany();
  }

  //get sup by id
  async getSupById(id: number) {
    return this.prisma.sup.findUnique({
      where: { id: id },
    });
  }

  //create new sup
  async createSup(data: Prisma.SupUncheckedCreateInput) {
    return this.prisma.sup.create({
      data,
    });
  }

  //delete sup by id
  async deleteSupById(id: number) {
    return this.prisma.sup.delete({
      where: { id: id },
    });
  }
  //update sup by id
  async updateSupById(id: number, data: Prisma.SupUpdateInput) {
    return this.prisma.sup.update({
      where: { id: id },
      data,
    });
  }
}
