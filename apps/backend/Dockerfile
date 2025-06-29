# apps/backend/Dockerfile

# —— Build Stage ——  
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 1. Declare build‐time arg and set as ENV
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# 2. Install deps (including prisma)
COPY package.json package-lock.json ./
RUN npm install

# 3. Copy Prisma schema & generate client
COPY prisma ./prisma
RUN npx prisma generate

# 4. Copy source & build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# —— Runtime Stage ——  
FROM node:18-alpine
WORKDIR /usr/src/app

# 5. Copy build artifacts + prisma client
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]