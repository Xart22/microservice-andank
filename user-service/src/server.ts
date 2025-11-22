import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import userRoutes from "./routes/user.routes";
import fastifyJwt from "@fastify/jwt";
import authRoutes from "./routes/auth.routes";

async function buildServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(prismaPlugin);

  // JWT
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "dev-secret-ganti-di-env",
  });

  // decorator untuk auth (bisa dipakai di handler)
  fastify.decorate("authenticate", async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });

  fastify.get("/health", async () => {
    return { status: "ok", service: "user-service" };
  });

  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(authRoutes, { prefix: "/auth" });

  return fastify;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }

  interface FastifyRequest {
    currentUser: {
      sub: number;
      email: string;
      role_id: number;
      sup_id: number | null;
      uptd_id: number | null;
    };
  }
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
