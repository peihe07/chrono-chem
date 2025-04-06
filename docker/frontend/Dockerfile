# 構建階段
FROM node:18-alpine AS builder

WORKDIR /app

# 創建非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產環境
FROM node:18-alpine

WORKDIR /app

# 創建非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 複製構建產物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 安裝生產依賴
RUN npm install --production

# 設置用戶權限
RUN chown -R appuser:appgroup /app

# 切換到非 root 用戶
USER appuser

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 啟動應用
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"] 