import { Prisma, PrismaClient } from "../../../generated/prisma/client";

export class LaporanMingguanService {
  constructor(private prisma: PrismaClient) {}

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
    dataLaporanMingguanId: number,
    data: Prisma.LaporanMingguanUncheckedUpdateInput
  ) {
    return this.prisma.laporanMingguan.update({
      where: {
        id: dataLaporanMingguanId,
      },
      data,
    });
  }

  deleteLaporanMingguan(dataLaporanMingguanId: number) {
    return this.prisma.laporanMingguan.delete({
      where: {
        id: dataLaporanMingguanId,
      },
    });
  }
}
