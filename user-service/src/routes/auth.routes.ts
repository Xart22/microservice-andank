import { FastifyInstance } from "fastify";
import { AuthService } from "../modules/auth/auth.service";
import { AuthController } from "../modules/auth/auth.controller";
import { loginSchema } from "../modules/auth/auth.schema";

export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma);
  const authController = new AuthController(authService);

  fastify.post("/login", { schema: loginSchema }, authController.login);

  fastify.get(
    "/me",
    {
      preHandler: [fastify.authenticate],
    },
    authController.me
  );
}
