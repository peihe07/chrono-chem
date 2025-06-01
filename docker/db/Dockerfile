FROM postgres:15

# 設置環境變數
ENV POSTGRES_DB=chronochem \
    POSTGRES_USER=chronochem \
    POSTGRES_PASSWORD=chronochem \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# 安裝必要的包
RUN apt-get update && apt-get install -y \
    cron \
    && rm -rf /var/lib/apt/lists/*

# 複製初始化腳本
COPY 01-extensions.sql /docker-entrypoint-initdb.d/
COPY 02-tables.sql /docker-entrypoint-initdb.d/

# 複製備份腳本
COPY backup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backup.sh

# 創建備份目錄
RUN mkdir -p /var/lib/postgresql/backups

# 設置 cron
COPY crontab /etc/cron.d/backup-cron
RUN chmod 0644 /etc/cron.d/backup-cron
RUN crontab /etc/cron.d/backup-cron

# 創建啟動腳本
RUN echo '#!/bin/bash\nservice cron start\nexec "$@"' > /docker-entrypoint-initdb.d/start-cron.sh \
    && chmod +x /docker-entrypoint-initdb.d/start-cron.sh

# 設置健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD pg_isready -U chronochem -d chronochem || exit 1 