import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class RumijaService {
  constructor(private prisma: PrismaClient) {}
  //get all rumija
  async getAllRumija() {
    return this.prisma.rumija.findMany();
  }

  //get rumija by id
  async getRumijaById(id: number) {
    return this.prisma.rumija.findUnique({
      where: { id: id },
    });
  }
  //create new rumija
  async createRumija(data: Prisma.RumijaUncheckedCreateInput) {
    return this.prisma.rumija.create({
      data,
    });
  }
  //delete rumija by id
  async deleteRumijaById(id: number) {
    return this.prisma.rumija.delete({
      where: { id: id },
    });
  }
  //update rumija by id
  async updateRumijaById(id: number, data: any) {
    return this.prisma.rumija.update({
      where: { id: id },
      data,
    });
  }
}
