import { Prisma, PrismaClient } from "../../../generated/prisma/client";

export class DataUmumFileService {
  constructor(private prisma: PrismaClient) {}

  async createDataUmumFile(header: Prisma.FileDokumenUncheckedCreateInput) {
    const created = await this.prisma.fileDokumen.create({
      data: header,
    });
    return created;
  }

  async getFilesByDataUmumId(dataUmumId: number) {
    const files = await this.prisma.fileDokumen.findMany({
      where: { data_umum_id: dataUmumId },
    });
    return files;
  }

  async deleteDataUmumFile(id: number) {
    await this.prisma.fileDokumen.delete({
      where: { id },
    });
  }
}
