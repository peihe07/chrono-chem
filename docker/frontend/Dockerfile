# 構建階段
FROM node:18-alpine AS builder

WORKDIR /app

# 創建非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產環境
FROM nginx:alpine

# 複製 nginx 配置
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 複製構建產物
COPY --from=builder /app/dist /usr/share/nginx/html

# 設置權限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# 切換到非 root 用戶
USER nginx

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"] 