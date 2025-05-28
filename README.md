# Chrono-Chem 化學實驗室管理系統

## 專案簡介
Chrono-Chem 是一個現代化的化學實驗室管理系統，提供實驗室資源管理、實驗排程、數據分析等功能。

## 技術棧
- 前端：Vue 3 + TypeScript + Vite
- 後端：Django + Django REST Framework
- 資料庫：PostgreSQL
- 快取：Redis
- 任務佇列：Celery
- 容器化：Docker

## 開發環境設置

### 前置需求
- Docker 和 Docker Compose
- Node.js 18+
- Python 3.10+

### 本地開發設置
1. 克隆專案
```bash
git clone https://github.com/your-username/chrono-chem.git
cd chrono-chem
```

2. 設置環境變數
```bash
cp .env.example .env
cp .env.local.example .env.local
```

3. 啟動開發環境
```bash
./dev.sh
```

### 開發指南
- 前端開發：`cd frontend && npm run dev`
- 後端開發：`cd backend && python manage.py runserver`
- 運行測試：`npm run test` (前端) 或 `pytest` (後端)

## 專案結構
```
chrono-chem/
├── frontend/          # Vue 3 前端應用
├── backend/           # Django 後端應用
├── docker/           # Docker 配置文件
└── dev-notes/        # 開發文檔
```

## API 文檔
API 文檔可在開發環境中訪問：http://localhost:8000/api/docs/

## 測試
- 前端測試：`npm run test`
- 後端測試：`pytest`
- 測試覆蓋率：`npm run test:coverage` 或 `pytest --cov`

## 部署
詳細的部署指南請參考 [部署文檔](docs/deployment.md)

## 貢獻指南
1. Fork 專案
2. 創建特性分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

## 授權
本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 聯繫方式
如有任何問題，請通過以下方式聯繫：
- 電子郵件：your-email@example.com
- 專案 Issues：https://github.com/your-username/chrono-chem/issues