import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class KegiatanRutinService {
  constructor(private prisma: PrismaClient) {}

  getAllKegiatanRutin() {
    return this.prisma.kegiatanRutin.findMany();
  }

  getKegiatanRutinById(id: number) {
    return this.prisma.kegiatanRutin.findUnique({
      where: { id },
    });
  }

  createKegiatanRutin(data: Prisma.KegiatanRutinCreateInput) {
    return this.prisma.kegiatanRutin.create({
      data,
    });
  }

  updateKegiatanRutin(id: number, data: Prisma.KegiatanRutinUpdateInput) {
    return this.prisma.kegiatanRutin.update({
      where: { id },
      data,
    });
  }

  deleteKegiatanRutin(id: number) {
    return this.prisma.kegiatanRutin.delete({
      where: { id },
    });
  }
}
