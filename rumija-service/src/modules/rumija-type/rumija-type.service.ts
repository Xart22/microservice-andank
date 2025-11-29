import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class RumijaTypeService {
  constructor(private prisma: PrismaClient) {}
  //get all rumija type
  async getAllRumijaType() {
    return this.prisma.rumijaType.findMany();
  }
  //get rumija type by id
  async getRumijaTypeById(id: number) {
    return this.prisma.rumijaType.findUnique({
      where: { id: id },
    });
  }
  //create new rumija type
  async createRumijaType(data: Prisma.RumijaTypeUncheckedCreateInput) {
    return this.prisma.rumijaType.create({
      data,
    });
  }
  //delete rumija type by id
  async deleteRumijaTypeById(id: number) {
    return this.prisma.rumijaType.delete({
      where: { id: id },
    });
  }
  //update rumija type by id
  async updateRumijaTypeById(id: number, data: any) {
    return this.prisma.rumijaType.update({
      where: { id: id },
      data,
    });
  }
}
