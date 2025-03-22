# 構建階段
FROM node:18-alpine as builder

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產階段
FROM node:18-alpine

WORKDIR /app

# 從構建階段複製構建結果
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# 只安裝生產環境依賴
RUN npm ci --only=production

# 設置環境變量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["npm", "start"] 