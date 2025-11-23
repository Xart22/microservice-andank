import { Prisma, PrismaClient } from "../../../generated/prisma/client";

export class DataUmumService {
  constructor(private prisma: PrismaClient) {}

  getDataUmum() {
    return this.prisma.dataUmum.findMany({
      include: {
        dataUmumDetails: true,
        laporanMingguans: true,
        fileDokumens: true,
      },
    });
  }

  getDataUmumById(id: string) {
    return this.prisma.dataUmum.findUnique({
      where: { id },
      include: {
        dataUmumDetails: true,
        laporanMingguans: true,
        fileDokumens: true,
      },
    });
  }

  async createDataUmum(
    dataUmum: Prisma.DataUmumUncheckedCreateInput,
    dataUmumDetail: Prisma.DataUmumDetailUncheckedCreateInput[],
    dataUmumRuas: Prisma.DataUmumRuasUncheckedCreateInput[]
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. buat header dataUmum
      const createdDataUmum = await tx.dataUmum.create({
        data: dataUmum,
      });

      const dataUmumId = createdDataUmum.id;

      await tx.dataUmumDetail.create({
        data: {
          ...dataUmumDetail[0],
          data_umum_id: dataUmumId,
        },
      });

      const dataUmumDetailId = await tx.dataUmumDetail.findFirst({
        where: {
          data_umum_id: dataUmumId,
        },
      });

      if (!dataUmumDetailId?.id) {
        throw new Error("Failed to create data umum detail");
      }

      const { id, ...ruasDataWithoutId } = dataUmumRuas[0];
      await tx.dataUmumRuas.create({
        data: {
          ...ruasDataWithoutId,
          data_umum_detail_id: dataUmumDetailId.id,
        },
      });

      const dataUmumWithDetail = await this.prisma.dataUmum.findUnique({
        where: { id: dataUmumId },
        include: {
          dataUmumDetails: true,
        },
      });
      const ruasWithDetail = await this.prisma.dataUmumRuas.findMany({
        where: {
          data_umum_detail_id: dataUmumDetailId.id,
        },
      });
      //merge hasil
      return {
        ...createdDataUmum,
        dataUmumDetails: dataUmumWithDetail?.dataUmumDetails || [],
        dataUmumRuas: ruasWithDetail,
      };
    });
  }
  updateDataUmum(id: string, data: Prisma.DataUmumUncheckedUpdateInput) {
    return this.prisma.dataUmum.update({
      where: { id },
      data,
    });
  }

  deleteDataUmum(id: string) {
    return this.prisma.dataUmum.delete({
      where: { id },
    });
  }

  createDataUmumWithDetails(
    dataUmumData: Prisma.DataUmumUncheckedCreateInput,
    detailsData: Prisma.DataUmumDetailUncheckedCreateInput[],
    dataUmumRuas: Prisma.DataUmumRuasUncheckedCreateInput[]
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const createdDataUmum = await prisma.dataUmum.create({
        data: dataUmumData,
      });
      const dataUmumId = createdDataUmum.id;
      const detailsWithDataUmumId = detailsData.map((detail) => ({
        ...detail,
        dataUmumId,
      }));
      const ruasWithDataUmumId = dataUmumRuas.map((ruas) => ({
        ...ruas,
        dataUmumId,
      }));
      await prisma.dataUmumDetail.createMany({
        data: detailsWithDataUmumId,
      });
      await prisma.dataUmumRuas.createMany({
        data: ruasWithDataUmumId,
      });
      return createdDataUmum;
    });
  }
}
