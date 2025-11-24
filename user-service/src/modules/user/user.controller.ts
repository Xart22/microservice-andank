// src/modules/user/user.controller.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "./user.service.js";

export class UserController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUsers = async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await this.userService.getAllUsers();
    return reply.send(users);
  };

  getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const user = await this.userService.getUserById(Number(id));

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    return reply.send(user);
  };

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await this.userService.createUser(req.body);
      return reply.code(201).send(user);
    } catch (err: any) {
      return reply.code(400).send({ message: err.message });
    }
  };

  updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const updated = await this.userService.updateUser(Number(id), req.body);

    return reply.send(updated);
  };

  deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await this.userService.deleteUser(Number(id));
    return reply.code(204).send();
  };

  generateTestUsers = async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await this.userService.generateTestUsers();
    return reply.send(users);
  };
}
