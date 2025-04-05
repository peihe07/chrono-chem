#!/bin/bash

# 確保在項目根目錄
cd "$(dirname "$0")"

# 設置資料庫環境變數
export POSTGRES_HOST=localhost
export POSTGRES_USER=peihe
export POSTGRES_PASSWORD=''
export POSTGRES_DB=chronochem

# 檢查必要的目錄是否存在
if [ ! -d "frontend" ]; then
    echo "錯誤：找不到 frontend 目錄"
    exit 1
fi

if [ ! -d "backend" ]; then
    echo "錯誤：找不到 backend 目錄"
    exit 1
fi

# 啟動後端服務器
cd backend
python manage.py migrate
python manage.py runserver 8001 &

# 等待後端啟動
sleep 2

# 啟動前端開發服務器
cd ../frontend
npm run dev 