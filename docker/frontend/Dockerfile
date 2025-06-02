# 構建階段
FROM node:18-alpine as builder

# 設置工作目錄
WORKDIR /app

# 添加非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴（使用 npm install 替代 npm ci，並添加緩存）
RUN npm install --prefer-offline --no-audit

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產階段
FROM nginx:1.25-alpine

# 複製構建產物
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# 設置權限
RUN chown -R nginx:nginx /usr/share/nginx/html

# 暴露端口
EXPOSE 80 443

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"] 