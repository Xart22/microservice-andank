import { PrismaClient, Prisma } from "../../generated/prisma/client.js";

export class RumijaKelasService {
  constructor(private prisma: PrismaClient) {}
  //get all rumija kelas
  async getAllRumijaKelas() {
    return this.prisma.rumijaKelas.findMany();
  }
  //get rumija kelas by id
  async getRumijaKelasById(id: number) {
    return this.prisma.rumijaKelas.findUnique({
      where: { id: id },
    });
  }
  //create new rumija kelas
  async createRumijaKelas(data: Prisma.RumijaKelasUncheckedCreateInput) {
    return this.prisma.rumijaKelas.create({
      data,
    });
  }
  //delete rumija kelas by id
  async deleteRumijaKelasById(id: number) {
    return this.prisma.rumijaKelas.delete({
      where: { id: id },
    });
  }
  //update rumija kelas by id
  async updateRumijaKelasById(id: number, data: any) {
    return this.prisma.rumijaKelas.update({
      where: { id: id },
      data,
    });
  }
}
