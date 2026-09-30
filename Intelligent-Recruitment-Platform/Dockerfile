# ==========================================
# 1. BUILD REACT FRONTEND
# ==========================================
FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ==========================================
# 2. FINAL IMAGE - MYSQL + NODE + NGINX
# ==========================================
FROM mysql:8.0-bookworm

ENV DEBIAN_FRONTEND=noninteractive

# Install Nginx, curl and other required tools
RUN apt-get update && \
    apt-get install -y nginx curl ca-certificates bash && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ==========================================
# Backend
# ==========================================
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend/ ./backend/

# ==========================================
# React frontend
# ==========================================
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# ==========================================
# Database SQL
# ==========================================
COPY database/intelligent_recruitment.sql /app/database/intelligent_recruitment.sql

# ==========================================
# Nginx
# ==========================================
COPY nginx.conf /etc/nginx/nginx.conf

# ==========================================
# Startup script
# ==========================================
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]