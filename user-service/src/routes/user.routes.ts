// src/routes/user.routes.ts

import { FastifyInstance } from "fastify";
import { UserService } from "../modules/user/user.service";
import { UserController } from "../modules/user/user.controller";
import {
  createUserSchema,
  updateUserSchema,
} from "../modules/user/user.schema";

export default async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify.prisma);
  const userController = new UserController(userService);

  fastify.get("/", userController.getUsers);

  fastify.get("/:id", userController.getUserById);

  fastify.post("/", { schema: createUserSchema }, userController.createUser);

  fastify.patch(
    "/:id",
    { schema: updateUserSchema },
    userController.updateUser
  );

  fastify.delete("/:id", userController.deleteUser);

  fastify.get("/generate-test-users", userController.generateTestUsers);
}
