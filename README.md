# ChronoChem - 化學史時間軸視覺化系統

ChronoChem 是一個基於 Web 的化學史時間軸視覺化系統，使用 Three.js 實現 3D 視覺化效果，幫助用戶更好地理解化學發展的歷史脈絡。

## 功能特點

- 3D 時間軸視覺化
- 化學家信息展示
- 重要事件標記
- 互動式探索
- 響應式設計

## 技術棧

### 後端
- Python 3.11
- Django 4.2
- Django REST framework
- PostgreSQL
- Gunicorn

### 前端
- Vue 3
- TypeScript
- Three.js
- Vite

### 開發工具
- Docker
- Docker Compose
- ESLint
- Prettier
- Flake8

## 系統要求

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (本地開發)
- Python 3.11+ (本地開發)

## 快速開始

1. 克隆專案
```bash
git clone https://github.com/yourusername/chrono-chem.git
cd chrono-chem
```

2. 設置環境變量
```bash
cp .env.example .env
# 編輯 .env 文件，設置必要的環境變量
```

3. 使用 Docker Compose 啟動服務
```bash
docker-compose up -d
```

4. 訪問應用
- 前端：http://localhost:3000
- 後端 API：http://localhost:8001
- 管理後台：http://localhost:8001/admin/

## 本地開發

### 後端開發
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py runserver
```

### 前端開發
```bash
cd frontend
npm install
npm run dev
```

## 專案結構

```
chrono-chem/
├── backend/           # Django 後端
├── frontend/         # Vue 前端
├── docker/           # Docker 配置文件
├── dev-notes/        # 開發筆記
└── docker-compose.yml
```

## 環境變量

所有環境變量都在 `.env.example` 文件中列出。開發時需要：

1. 複製 `.env.example` 為 `.env`
2. 根據需要修改 `.env` 中的值
3. 確保敏感信息（如密碼、API 密鑰）使用安全的值

## 開發指南

### 代碼風格

- 前端使用 ESLint 和 Prettier
- 後端使用 Flake8
- 遵循 EditorConfig 配置

### 提交規範

- feat: 新功能
- fix: 修復問題
- docs: 文檔修改
- style: 代碼格式修改
- refactor: 代碼重構
- test: 測試用例修改
- chore: 其他修改

## 部署

1. 構建 Docker 鏡像
```bash
docker-compose build
```

2. 啟動服務
```bash
docker-compose up -d
```

## 貢獻指南

1. Fork 專案
2. 創建特性分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

## 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 聯繫方式

- 作者：[您的名字]
- 郵箱：[您的郵箱]
- 網站：[您的網站] 