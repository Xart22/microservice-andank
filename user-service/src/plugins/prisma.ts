// src/plugins/prisma.ts
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

async function prismaPlugin(fastify: FastifyInstance) {
  const prisma = new PrismaClient();

  await prisma.$connect();
  fastify.log.info("Prisma connected to MySQL");

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (app) => {
    app.log.info("Disconnecting Prisma");
    await app.prisma.$disconnect();
  });
}

export default fp(prismaPlugin);
