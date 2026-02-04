import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class RumijaService {
  constructor(private prisma: PrismaClient) {}

  // Get all rumija
  async getAllRumija() {
    return this.prisma.rumija.findMany();
  }

  // Get rumija by id
  async getRumijaById(id: number) {
    return this.prisma.rumija.findUnique({
      where: { id },
    });
  }

  // Create new rumija
  async createRumija(data: Prisma.RumijaUncheckedCreateInput) {
    return this.prisma.rumija.create({
      data,
    });
  }

  // Update rumija by id
  async updateRumijaById(id: number, data: Prisma.RumijaUncheckedUpdateInput) {
    return this.prisma.rumija.update({
      where: { id },
      data,
    });
  }

  // Delete rumija by id
  async deleteRumijaById(id: number) {
    return this.prisma.rumija.delete({
      where: { id },
    });
  }
}
