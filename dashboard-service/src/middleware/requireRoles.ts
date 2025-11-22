import { FastifyReply, FastifyRequest } from "fastify";

export function requireRoles(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user || !user.role_name) {
      return reply.code(403).send({ message: "Forbidden" });
    }

    const current = user.role_name.toUpperCase();
    const allowed = roles.map((r) => r.toUpperCase());

    if (!allowed.includes(current)) {
      return reply.code(403).send({ message: "Forbidden" });
    }
  };
}
