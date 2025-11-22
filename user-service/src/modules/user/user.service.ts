// src/modules/user/user.service.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export class UserService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        role: true,
        sup: true,
        uptd: true,
      },
    });
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        sup: true,
        uptd: true,
      },
    });
  }

  async createUser(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("Email already exists");
    }

    return this.prisma.user.create({
      data,
    });
  }

  updateUser(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
  async generateTestUsers() {
    const testUsers = [];
    for (let i = 1; i <= 10; i++) {
      const email = `testuser${i}@example.com`;
      const password = await bcrypt.hash("password123", 10);

      const user = await this.prisma.user.create({
        data: {
          name: `Test User ${i}`,
          email,
          password,
          role: {
            connect: { id: 1 }, // Replace with actual role ID
          },
          sup: {
            connect: { id: 1 }, // Replace with actual sup ID
          },
          uptd: {
            connect: { id: 1 }, // Replace with actual uptd ID
          },
        },
      });
      testUsers.push(user);
    }
    return testUsers;
  }
}
