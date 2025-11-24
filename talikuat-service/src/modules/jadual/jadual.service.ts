import { Prisma, PrismaClient } from "../../generated/prisma/client.js";

// Supaya enak, kita buang FK dulu dari type detail
type JadualDetailCreateWithoutFK = Omit<
  Prisma.JadualDetailUncheckedCreateInput,
  "jadual_id"
>;

export class JadualService {
  constructor(private prisma: PrismaClient) {}

  async createJadual(
    header: Prisma.JadualUncheckedCreateInput,
    details: JadualDetailCreateWithoutFK[]
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1) Buat jadual (header)
      const createdJadual = await tx.jadual.create({
        data: header,
      });

      // 2) Buat detail-detailnya
      if (details.length > 0) {
        await tx.jadualDetail.createMany({
          data: details.map((d) => ({
            ...d,
            jadual_id: createdJadual.id,
          })),
        });
      }

      // 3) Ambil lagi lengkap dengan detail
      const result = await tx.jadual.findUnique({
        where: { id: createdJadual.id },
        include: {
          jadualDetails: true,
        },
      });

      return result;
    });
  }

  updateJadual = async (
    id: number,
    header: Prisma.JadualUncheckedUpdateInput,
    details: JadualDetailCreateWithoutFK[]
  ) => {
    return this.prisma.$transaction(async (tx) => {
      // 1) Update jadual (header)
      const updatedJadual = await tx.jadual.update({
        where: { id },
        data: header,
      });
      // 2) Hapus detail lama
      await tx.jadualDetail.deleteMany({
        where: { jadual_id: id },
      });
      // 3) Buat detail baru
      if (details.length > 0) {
        await tx.jadualDetail.createMany({
          data: details.map((d) => ({
            ...d,
            jadual_id: updatedJadual.id,
          })),
        });
      }
      // 4) Ambil lagi lengkap dengan detail
      const result = await tx.jadual.findUnique({
        where: { id: updatedJadual.id },
        include: {
          jadualDetails: true,
        },
      });
      return result;
    });
  };

  async getJadualById(id: number) {
    return this.prisma.jadual.findUnique({
      where: { id },
      include: {
        jadualDetails: true,
      },
    });
  }

  async getJadualByDataUmumDetailId(dataUmumDetailId: number) {
    return this.prisma.jadual.findMany({
      where: { data_umum_detail_id: dataUmumDetailId },
      include: {
        jadualDetails: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}
