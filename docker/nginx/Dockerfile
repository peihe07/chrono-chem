FROM nginx:1.25-alpine

# 複製 nginx 配置
COPY docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# 創建必要的目錄
RUN mkdir -p /usr/share/nginx/static /usr/share/nginx/media

# 設置權限
RUN chown -R nginx:nginx /usr/share/nginx/static /usr/share/nginx/media

# 暴露端口
EXPOSE 80 443

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"] 