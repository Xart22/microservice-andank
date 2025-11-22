// src/middlewares/requireRoles.ts
import type { FastifyReply, FastifyRequest } from "fastify";

export function requireRoles(roles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = request.user; // diisi oleh jwtVerify di authenticate

    if (!user || !user.role_name) {
      return reply.code(403).send({ message: "Forbidden" });
    }

    // case-insensitive biar aman
    const currentRole = user.role_name.toUpperCase();
    const allowedRoles = roles.map((r) => r.toUpperCase());

    if (!allowedRoles.includes(currentRole)) {
      return reply.code(403).send({ message: "Forbidden" });
    }
  };
}
