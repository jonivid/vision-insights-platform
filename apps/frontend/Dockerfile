# apps/frontend/Dockerfile

# ─── Stage 1: Build the Vite app ────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 1) Install dependencies (cached layer)
COPY package.json package-lock.json ./
RUN npm install

# 2) Copy all project files (including index.html, tsconfig*, public, src)
COPY . .

# 3) Build the static site
RUN npm run build


# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# 4) Remove default Nginx content
RUN rm -rf ./*

# 5) Copy build output from the builder stage
COPY --from=builder /usr/src/app/dist ./

# 6) Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7) Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]