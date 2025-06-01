#!/bin/bash

# 設置變數
BACKUP_DIR="/var/lib/postgresql/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/chronochem_$DATE.sql"

# 創建備份目錄
mkdir -p $BACKUP_DIR

# 執行備份
pg_dump -U chronochem -d chronochem > $BACKUP_FILE

# 壓縮備份文件
gzip $BACKUP_FILE

# 刪除超過 7 天的備份
find $BACKUP_DIR -name "chronochem_*.sql.gz" -mtime +7 -delete

# 輸出備份結果
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE.gz"
else
    echo "Backup failed!"
    exit 1
fi 