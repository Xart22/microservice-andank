// src/middlewares/requireRoles.ts
import type { FastifyReply, FastifyRequest } from "fastify";

export function requireRoles(roles: number[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    // pastikan token sudah diverifikasi dulu
    // biasanya middleware ini dipasang setelah fastify.authenticate

    const user = (request as any).user as {
      role_id: number;
    };

    if (!user || !roles.includes(user.role_id)) {
      return reply.code(403).send({ message: "Forbidden" });
    }
  };
}
