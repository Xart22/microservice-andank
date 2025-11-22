import bcrypt from "bcrypt";
import { PrismaClient } from "../../../generated/prisma/client";

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true, // ⬅ penting, biar dapet user.role.name
      },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }
}
