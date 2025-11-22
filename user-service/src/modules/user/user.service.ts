import bcrypt from "bcrypt";
import { PrismaClient } from "../../../generated/prisma/client";

export class UserService {
  constructor(private prisma: PrismaClient) {}

  getAllUsers() {
    return this.prisma.user.findMany({
      include: { role: true },
    });
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async createUser(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("Email already exists");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role_id: data.role_id,
        sup_id: data.sup_id ?? null,
        uptd_id: data.uptd_id ?? null,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  updateUser(id: number, data: any) {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = bcrypt.hashSync(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async generateTestUsers() {
    const testUsers = [
      {
        name: "Test User 1",
        email: "test1@example.com",
        password: "password1",
        role_id: 1,
        uptd_id: 1,
      },
      {
        name: "Test User 2",
        email: "test2@example.com",
        password: "password2",
        role_id: 1,
        uptd_id: 2,
      },
    ];

    const createdUsers = [];
    for (const user of testUsers) {
      const createdUser = await this.createUser(user);
      createdUsers.push(createdUser);
    }

    return createdUsers;
  }
}
