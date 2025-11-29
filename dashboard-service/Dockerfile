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

# 5. Copy generated prisma files (termasuk .ts) ke dist
RUN cp -r src/generated dist/ || true

# 6. Set env production
ENV NODE_ENV=production

# 7. Expose port
EXPOSE 3000

# 8. Jalankan migrate + start
CMD ["sh", "-c", "node dist/server.js"]