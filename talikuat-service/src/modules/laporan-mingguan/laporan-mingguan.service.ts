import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

export class LaporanMingguanService {
  constructor(private prisma: PrismaClient) {}

  getAllLaporanMingguan() {
    return this.prisma.laporanMingguan.findMany({
      include: {
        data_umum: true,
      },
    });
  }

  getLaporanMingguanById(id: number) {
    return this.prisma.laporanMingguan.findUnique({
      where: { id },
      include: {
        data_umum: true,
      },
    });
  }

  getLaporanMingguanByDataUmumId(dataUmumId: number) {
    return this.prisma.laporanMingguan.findMany({
      where: {
        data_umum_id: dataUmumId,
      },
    });
  }

  createLaporanMingguan(data: Prisma.LaporanMingguanUncheckedCreateInput) {
    return this.prisma.laporanMingguan.create({
      data,
    });
  }

  updateLaporanMingguan(
    id: number,
    data: Prisma.LaporanMingguanUncheckedUpdateInput,
  ) {
    return this.prisma.laporanMingguan.update({
      where: { id },
      data,
    });
  }

  deleteLaporanMingguan(id: number) {
    return this.prisma.laporanMingguan.delete({
      where: { id },
    });
  }
}
