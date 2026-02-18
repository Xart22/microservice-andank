import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

type DataUmumDetailCreateWithoutFK = Omit<
  Prisma.DataUmumDetailUncheckedCreateInput,
  "data_umum_id"
>;

type DataUmumRuasCreateWithoutFK = Omit<
  Prisma.DataUmumRuasUncheckedCreateInput,
  "data_umum_detail_id"
>;

export class DataUmumService {
  constructor(private prisma: PrismaClient) {}

  async createDataUmum(
    header: Prisma.DataUmumUncheckedCreateInput,
    detail: DataUmumDetailCreateWithoutFK,
    ruasList: DataUmumRuasCreateWithoutFK[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const createdHeader = await tx.dataUmum.create({
        data: header,
      });

      const createdDetail = await tx.dataUmumDetail.create({
        data: {
          ...detail,
          data_umum_id: createdHeader.id,
        },
      });

      if (ruasList.length > 0) {
        await tx.dataUmumRuas.createMany({
          data: ruasList.map((ruas) => ({
            ...ruas,
            data_umum_detail_id: createdDetail.id,
          })),
        });
      }

      const result = await tx.dataUmum.findUnique({
        where: { id: createdHeader.id },
        include: {
          detail: {
            include: {
              dataUmumRuas: true,
            },
          },
          laporanMingguans: true,
          fileDokumens: true,
        },
      });

      return result;
    });
  }

  getAllDataUmum() {
    return this.prisma.dataUmum.findMany({
      include: {
        detail: {
          include: {
            dataUmumRuas: true,
          },
        },
        laporanMingguans: true,
        fileDokumens: true,
      },
    });
  }

  getDataUmumById(id: number) {
    return this.prisma.dataUmum.findUnique({
      where: { id },
      include: {
        detail: {
          include: {
            dataUmumRuas: true,
          },
        },
        laporanMingguans: true,
        fileDokumens: true,
      },
    });
  }

  // update data umum
  updateDataUmum(
    id: number,
    header: Prisma.DataUmumUncheckedCreateInput,
    detail: DataUmumDetailCreateWithoutFK,
    ruasList: DataUmumRuasCreateWithoutFK[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedHeader = await tx.dataUmum.update({
        where: { id },
        data: header,
      });
      const existingDetail = await tx.dataUmumDetail.findFirst({
        where: { data_umum_id: id },
      });
      if (existingDetail) {
        await tx.dataUmumDetail.update({
          where: { id: existingDetail.id },
          data: {
            ...detail,
          },
        });
        await tx.dataUmumRuas.deleteMany({
          where: { data_umum_detail_id: existingDetail.id },
        });
        if (ruasList.length > 0) {
          await tx.dataUmumRuas.createMany({
            data: ruasList.map((ruas) => ({
              ...ruas,
              data_umum_detail_id: existingDetail.id,
            })),
          });
        }
      } else {
        const createdDetail = await tx.dataUmumDetail.create({
          data: {
            ...detail,
            data_umum_id: updatedHeader.id,
          },
        });
        if (ruasList.length > 0) {
          await tx.dataUmumRuas.createMany({
            data: ruasList.map((ruas) => ({
              ...ruas,
              data_umum_detail_id: createdDetail.id,
            })),
          });
        }
      }

      const result = await tx.dataUmum.findUnique({
        where: { id: updatedHeader.id },
        include: {
          detail: {
            include: {
              dataUmumRuas: true,
            },
          },
          laporanMingguans: true,
          fileDokumens: true,
        },
      });
      return result;
    });
  }

  deleteDataUmum(id: number) {
    return this.prisma.dataUmum.delete({
      where: { id },
    });
  }

  createAdendum(
    id: number,
    header: Partial<Prisma.DataUmumUncheckedCreateInput>,
    detail: DataUmumDetailCreateWithoutFK,
    ruasList: DataUmumRuasCreateWithoutFK[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const existingHeader = await tx.dataUmum.findUnique({
        where: { id },
      });
      if (!existingHeader) {
        throw new Error("Data Umum not found");
      }

      // Update header if there are changes
      if (Object.keys(header).length > 0) {
        await tx.dataUmum.update({
          where: { id },
          data: header,
        });
      }

      // Set not active to existing detail
      await tx.dataUmumDetail.updateMany({
        where: { data_umum_id: id, is_active: true },
        data: { is_active: false },
      });

      // Create new detail
      const createdDetail = await tx.dataUmumDetail.create({
        data: {
          ...detail,
          data_umum_id: id,
        },
      });

      // Create new ruas
      if (ruasList.length > 0) {
        await tx.dataUmumRuas.createMany({
          data: ruasList.map((ruas) => ({
            ...ruas,
            data_umum_detail_id: createdDetail.id,
          })),
        });
      }

      // Return full data structure
      const result = await tx.dataUmum.findUnique({
        where: { id },
        include: {
          detail: {
            where: { is_active: true },
            include: {
              dataUmumRuas: true,
            },
          },
          laporanMingguans: true,
          fileDokumens: true,
        },
      });

      return result;
    });
  }

  getDataUmumByAuth(uptdId: number) {
    return this.prisma.dataUmum.findMany({
      where: { uptd_id: uptdId },
      include: {
        detail: {
          include: {
            dataUmumRuas: true,
          },
        },
        laporanMingguans: true,
        fileDokumens: true,
      },
    });
  }
}
