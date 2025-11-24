import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJwt from "@fastify/jwt";
import prismaPlugin from "./plugins/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

async function buildServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Prisma
  await fastify.register(prismaPlugin);

  // JWT
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "dev-secret",
  });

  // middleware auth
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify(); // kalau valid, request.user keisi
      } catch (err) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );

  fastify.get("/health", async () => {
    return { status: "ok", service: "user-service" };
  });

  // routes
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(userRoutes, { prefix: "/users" });

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("User service running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

// ---------- Type augmentation (biar request.user & fastify.authenticate dikenali TS)

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: number;
      email: string;
      role_id: number;
      role_name: string | null;
      sup_id: number | null;
      uptd_id: number | null;
    };
    user: {
      sub: number;
      email: string;
      role_id: number;
      role_name: string | null;
      sup_id: number | null;
      uptd_id: number | null;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
