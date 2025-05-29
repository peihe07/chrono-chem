# ChronoChem: Explore Chemistry Through Time

## 專案簡介
ChronoChem 是一個創新的化學教育平台，讓使用者能夠穿越時空，探索化學史上的重要發現。透過 3D 互動技術，使用者可以親身體驗歷史上的重大化學實驗，與著名化學家對話，深入了解化學發展的歷程。

## 技術棧
- 前端：
  - Vue 3 + TypeScript
  - Three.js (3D 渲染)
  - Vue Router (時間旅行功能)
  - GLTFLoader (3D 模型載入)
  - OrbitControls (相機控制)
  - Jest + Vue Test Utils (測試框架)
  - ESLint + Prettier (程式碼規範)
- 後端：
  - Django 4.2 + Django REST Framework
  - PostgreSQL
  - GPT-4 API (歷史人物對話生成)
  - pytest (測試框架)
  - Celery (非同步任務)
- 部署：
  - Docker + Docker Compose
  - AWS / Firebase Hosting
  - Nginx (反向代理)

## 核心功能
1. **時間旅行系統**
   - 穿越不同時代的化學實驗室
   - 互動式時光機界面
   - 歷史事件時間軸

2. **3D 化學實驗室**
   - 真實還原歷史實驗室場景
   - 自由探索的 3D 環境
   - 高品質光影效果

3. **互動歷史人物**
   - 與著名化學家對話
   - AI 生成的歷史對話內容
   - 深入了解化學發現過程

4. **化學實驗模擬**
   - 普利斯特里發現氧氣
   - 門捷列夫排列元素週期表
   - 瑪麗居禮發現鐳的研究

## 開發環境設置

### 前置需求
- Docker 和 Docker Compose
- Node.js 18+
- Python 3.11+
- Git

### 本地開發設置
1. 克隆專案
```bash
git clone https://github.com/peihe07/chrono-chem.git
cd chrono-chem
```

2. 設置環境變數
創建以下文件並設置適當的值：
- `.env.development`：開發環境配置
- `.env.production`：生產環境配置

環境變數模板：
```bash
# Django 設置
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=django-insecure-dev-key-change-in-production
DJANGO_SETTINGS_MODULE=config.settings

# 資料庫設置
POSTGRES_DB=chronochem
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432

# OpenAI API 設置
OPENAI_API_KEY=your-api-key-here

# 前端設置
NODE_ENV=development
VITE_API_URL=http://localhost:8001

# 3D 模型設置
MODEL_PATH=/models

# CORS 設置
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Redis 設置
REDIS_URL=redis://redis:6379/0

# Celery 設置
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

3. 啟動開發環境
```bash
# 啟動開發環境
./dev.sh --dev

# 查看服務狀態
docker-compose ps

# 查看服務日誌
./dev.sh --logs
```

### 開發指南
- 前端開發：
  - 開發服務器：`http://localhost:3000`
  - Three.js 場景編輯器：`http://localhost:3000/editor`
  - API 代理：已配置到後端服務
  - 測試：`npm run test`

- 後端開發：
  - API 服務器：`http://localhost:8001`
  - API 文檔：`http://localhost:8001/api/docs/`
  - 管理介面：`http://localhost:8001/admin/`
  - 測試：`pytest`

- 3D 資源：
  - 模型目錄：`/models`
  - 材質目錄：`/materials`
  - 場景配置：`/scenes`

## 專案結構
```
chronochem/
├── frontend/          # Vue 3 前端應用
│   ├── src/
│   │   ├── components/    # Vue 組件
│   │   ├── scenes/        # Three.js 場景
│   │   ├── models/        # 3D 模型
│   │   └── router/        # 路由配置
├── backend/           # Django 後端應用
│   ├── api/           # API 端點
│   ├── models/        # 資料模型
│   └── services/      # 業務邏輯
├── docker/           # Docker 配置文件
└── docs/            # 專案文檔
```

## 開發時程
1. **第一週：基礎架構**
   - Three.js 場景搭建
   - Vue + Three.js 整合
   - Django API 架構
   - 完成標準：基礎場景可正常載入

2. **第二週：時間旅行 & 互動**
   - 時光機 UI
   - 3D 環境控制
   - GPT-4 對話整合
   - 完成標準：可切換不同時代場景

3. **第三週：視覺優化**
   - 場景效果優化
   - 音效系統
   - 多場景支援
   - 完成標準：場景效果流暢

4. **第四週：部署 & 測試**
   - 系統整合
   - 性能優化
   - 容器化部署
   - 完成標準：可穩定運行

## 常見問題
1. **Docker 容器無法啟動**
   - 檢查 Docker 服務是否運行
   - 檢查端口是否被占用
   - 檢查環境變數是否正確

2. **環境變數未生效**
   - 確認 `.env.development` 文件存在
   - 重新啟動 Docker 容器
   - 檢查 Docker Compose 配置

3. **3D 模型載入失敗**
   - 檢查模型文件格式
   - 確認模型路徑正確
   - 檢查瀏覽器控制台錯誤

## 貢獻指南
1. Fork 專案
2. 創建特性分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

### 程式碼規範
- 使用 ESLint 和 Prettier 格式化程式碼
- 遵循 Vue 3 風格指南
- 遵循 Django 編碼規範

### 提交訊息規範
- feat: 新增功能
- fix: 修復問題
- docs: 文檔更新
- style: 程式碼格式
- refactor: 重構
- test: 測試
- chore: 構建過程或輔助工具的變動

## 授權
本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 聯繫方式
- 電子郵件：y450376@gmail.com