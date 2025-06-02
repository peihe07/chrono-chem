# ChronoChem - 化學時空之旅 🌟

![ChronoChem](https://github.com/user-attachments/assets/d7c3a29f-fd11-4b26-9dbb-ad596fb31d54)

ChronoChem 是一個創新的教育平台，讓使用者能夠穿越時空，與歷史上著名的化學家進行互動對話，探索化學發展的精彩歷程。

## ✨ 主要功能

- 🧪 3D 互動場景：探索不同時期的化學實驗室
- 👨‍🔬 化學家對話：與歷史上的化學家進行 AI 驅動的對話
- 📚 歷史事件：了解重要的化學發現和突破
- 🌍 時空旅行：體驗不同時期的化學發展

## 🚀 快速開始

### 系統需求

- Node.js 18+
- Python 3.8+
- PostgreSQL 13+
- Redis 7+
- Docker & Docker Compose (可選)

### 使用 Docker 運行（推薦）

```bash
# 克隆專案
git clone https://github.com/peihe07/chrono-chem.git
cd chrono-chem

# 複製環境變數範例文件
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 使用 Docker Compose 啟動
docker-compose up -d
```

### 手動安裝

1. 後端設置：
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. 前端設置：
```bash
cd frontend
npm install
npm run dev
```

## 📚 技術棧

### 前端
- Vue 3
- Three.js
- TypeScript
- Vite
- Pinia
- Axios

### 後端
- Django
- Django REST Framework
- PostgreSQL
- Redis
- Celery
- OpenAI API
- Nginx

## 🔧 開發指南

### 目錄結構
```
chrono-chem/
├── frontend/          # Vue 3 前端
│   ├── src/          # 源代碼
│   ├── public/       # 靜態資源
│   └── dist/         # 構建輸出
├── backend/          # Django 後端
│   ├── api/         # API 應用
│   ├── core/        # 核心配置
│   └── media/       # 媒體文件
├── docker/          # Docker 配置
│   ├── backend/    # 後端 Dockerfile
│   ├── db/         # 數據庫配置
│   └── nginx/      # Nginx 配置
└── docs/           # 文檔
```

### 環境變數
專案需要以下環境變數：

#### 後端 (.env)
```bash
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/chrono_chem
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your-openai-api-key
MODEL_NAME=gpt-4
MAX_TOKENS=500
TEMPERATURE=0.7
```

#### 前端 (.env)
```bash
VITE_API_URL=http://localhost:8001/api/v1/
VITE_WS_URL=ws://localhost:8001/ws/
```

## 📝 版本歷史

### v1.0.1 (當前版本)
- 修復合併衝突
- 優化 Docker 配置
- 改進 Nginx 設置
- 更新環境變數配置

### v1.0.0
- 完成核心功能實現
- 支援化學家對話
- 3D 場景展示
- 歷史事件瀏覽

### v1.1.0 (規劃中)
- 效能優化
- 事件動畫
- 使用者回饋系統
- 分享功能

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 👥 團隊

- 開發者：[peihe]

## 🙏 致謝

- [OpenAI](https://openai.com/) - 提供 AI 對話能力
- [Three.js](https://threejs.org/) - 3D 渲染引擎
- [Vue.js](https://vuejs.org/) - 前端框架
- [Django](https://www.djangoproject.com/) - 後端框架
- [Redis](https://redis.io/) - 緩存和消息隊列
- [Celery](https://docs.celeryq.dev/) - 異步任務處理

## 📞 聯絡方式

- 專案連結：[https://github.com/peihe07/chrono-chem]
- 電子郵件：your.email@example.com

## ⚠️ 已知限制

- 部分效能優化功能將在 v1.1.0 中實現
- 使用者回饋系統正在開發中
- 分享功能將在後續版本加入

## 🔮 未來規劃

- 支援更多化學家
- 加入實驗模擬功能
- 擴充互動動畫
- 優化載入時間
- 實作評分系統
