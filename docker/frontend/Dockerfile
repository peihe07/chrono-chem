# 構建階段
FROM node:18-alpine as builder

WORKDIR /app

# 添加非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 複製 package 文件
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm install

# 複製源代碼
COPY . .

# 建議先進行類型檢查
RUN npm run type-check
# 然後再建置
RUN npm run build

# 或者暫時跳過類型檢查
RUN npm run build-skip-ts

# 更新 vue-tsc 到最新版本
RUN npm install vue-tsc@latest

# 確保 typescript 版本相容
RUN npm install typescript@latest

# 生產階段
FROM node:18-alpine

WORKDIR /app

# 添加非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 從構建階段複製構建結果
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./

# 只安裝生產環境依賴
RUN npm install --omit=dev && \
    npm cache clean --force

# 設置環境變量
ENV NODE_ENV=production \
    PORT=3000

# 修改目錄權限
RUN chown -R appuser:appgroup /app

# 切換到非 root 用戶
USER appuser

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 啟動應用
CMD ["npm", "start"] 