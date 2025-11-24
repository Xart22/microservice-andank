FROM node:22-alpine

WORKDIR /app

# 1. Copy file package dan install deps
COPY package*.json ./
RUN npm install

# 2. Prisma: schema + generate client
COPY prisma ./prisma
RUN npx prisma generate

# 3. Copy source code
COPY . .

# 4. Build TypeScript ke dist/
RUN npm run build

# 5. Set env production (opsional tapi bagus)
ENV NODE_ENV=production

# 6. Expose port (sesuaikan dengan yang kamu pakai di server.ts)
EXPOSE 3004

# 7. Jalankan migrate + start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
