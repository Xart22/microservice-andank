import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class SapulobangService {
  constructor(private prisma: PrismaClient) {}

  getAllSapulobang() {
    return this.prisma.sapulobang.findMany();
  }

  getSapulobangById(id: number) {
    return this.prisma.sapulobang.findUnique({
      where: { id },
    });
  }

  createSapulobang(data: Prisma.SapulobangCreateInput) {
    return this.prisma.sapulobang.create({
      data,
    });
  }

  updateSapulobang(id: number, data: Prisma.SapulobangUpdateInput) {
    return this.prisma.sapulobang.update({
      where: { id },
      data,
    });
  }

  deleteSapulobang(id: number) {
    return this.prisma.sapulobang.delete({
      where: { id },
    });
  }

  findSapulobangByRuasId(ruas_jalan_id: number) {
    return this.prisma.sapulobang.findMany({
      where: { ruas_jalan_id },
    });
  }

  findSapulobangBySupId(sup_id: number) {
    return this.prisma.sapulobang.findMany({
      where: { sup_id },
    });
  }

  findSapulobangByUptdId(uptd_id: number) {
    return this.prisma.sapulobang.findMany({
      where: { uptd_id },
    });
  }

  findSapulobangByUserId(user_id: number) {
    return this.prisma.sapulobang.findMany({
      where: { created_by: user_id },
    });
  }
}
