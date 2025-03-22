# **ChronoChem MVP 規劃**

## **📝 專案概述**
ChronoChem: Explore Chemistry Through Time 是一款基於 **Vue3 + Three.js + Django** 的 Web 應用，讓使用者能夠穿越不同時代，探索歷史上的重大化學發現，並與著名化學家互動。

## **🎯 MVP 目標**
**核心功能：**
1. **時間旅行系統**
   - 使用 **Vue Router** 切換不同時代 (如 1774 年普利斯特里實驗室、1869 年門捷列夫的元素週期表發表)。
   - 設計 UI 時光機，使用者可選擇化學史上的關鍵時刻。

2. **3D 化學實驗室**
   - 使用 **Three.js** 載入 **GLTF / OBJ** 建築模型，還原當時的化學實驗室。
   - 加入 **相機控制 (OrbitControls)**，讓使用者自由探索場景。

3. **互動歷史人物**
   - 點擊歷史化學家 (如 **普利斯特里、門捷列夫、瑪麗居禮**)，可與其對話。
   - **GPT-4** 生成對話內容，使化學家能解釋其研究發現。

4. **化學實驗模擬**
   - 設計 **可交互的化學實驗**，如:
     - 1774 年：普利斯特里發現氧氣實驗
     - 1869 年：門捷列夫排列元素週期表
     - 1898 年：瑪麗居禮發現鐳 (Radium) 的研究
   - 透過簡單動畫或 3D 模型模擬實驗過程。

5. **Django 後端 API**
   - 建立 **歷史化學事件資料庫** (年份、化學家、發現、相關實驗等)。
   - 提供 API 讓前端獲取不同時代的資訊。

## **🛠️ 技術棧**
**前端 (Vue3 + Three.js)**
- Vue 3 + TypeScript
- Vue Router (時間旅行功能)
- Three.js (3D 渲染)
- GLTFLoader (載入 3D 化學實驗室模型)
- OrbitControls (相機控制)

**後端 (Django + PostgreSQL)**
- Django 4.2
- Django REST Framework (API 提供歷史資料)
- PostgreSQL (存儲化學事件 & 歷史人物資訊)
- GPT-4 API (生成歷史化學家對話)

**部署**
- AWS 或 Firebase Hosting
- Docker 容器化應用

## **📆 開發時程 (4 週規劃)**
### **第一週：基礎架構**
✅ 研究 Three.js 基本場景搭建
✅ Vue + Three.js 設置
✅ 載入 GLTF 化學實驗室模型
✅ Django API 基礎架構 (化學事件 & 歷史數據)

### **第二週：時間旅行 & 互動**
✅ Vue Router 時光機 UI
✅ 相機控制 & 3D 環境調整
✅ 點擊化學家顯示歷史對話 (GPT-4 整合)
✅ Django 整合 API，提供化學歷史數據

### **第三週：強化視覺**
✅ 加入光影 & 材質 (Three.js 調整場景效果)
✅ 增加背景音樂 (符合歷史時代的音效)
✅ 優化 3D 資源載入速度
✅ 增加多個時代場景 (測試不同 GLTF 模型)

### **第四週：優化 & 部署**
✅ 整合 Three.js + Vue3 + Django API
✅ 前後端測試 & 修正 Bug
✅ Docker 容器化
✅ 部署到 AWS / Firebase Hosting

## **🚀 後續計劃**
- **Blender 設計 3D 化學實驗室** (逐步替換現成 GLTF 模型)
- **AI 生成歷史風格場景 (Stable Diffusion)**
- **多人連線模式 (WebRTC)**
- **更多可互動化學實驗**

