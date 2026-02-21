// src/routes/user.routes.ts

import { FastifyInstance } from "fastify";
import { UserService } from "../modules/user/user.service.js";
import { UserController } from "../modules/user/user.controller.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../modules/user/user.schema.js";
import { requireRoles } from "../middleware/requireRoles.js";

export default async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify.prisma);
  const userController = new UserController(userService);

  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate, requireRoles(["SUPERADMIN", "ADMIN"])],
    },
    userController.getUsers
  );

  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    userController.getUserById
  );

  fastify.post(
    "/",
    {
      preHandler: [fastify.authenticate, requireRoles(["SUPERADMIN", "ADMIN"])],
      schema: createUserSchema,
    },
    userController.createUser
  );

  fastify.patch(
    "/:id",
    {
      preHandler: [fastify.authenticate],
      schema: updateUserSchema,
    },
    userController.updateUser
  );

  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate, requireRoles(["SUPERADMIN", "ADMIN"])],
    },
    userController.deleteUser
  );

  fastify.get("/generate-test-users", userController.generateTestUsers);
}
