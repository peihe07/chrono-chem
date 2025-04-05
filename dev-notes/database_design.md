# ChronoChem 資料庫設計

## 資料表結構

### 1. 化學家（Chemists）
```sql
CREATE TABLE chemists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_year INTEGER NOT NULL,
    death_year INTEGER,
    bio TEXT,
    portrait_path VARCHAR(255),
    model_path VARCHAR(255),
    position_x FLOAT,
    position_y FLOAT,
    position_z FLOAT,
    era_id INTEGER REFERENCES eras(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 歷史事件（HistoricalEvents）
```sql
CREATE TABLE historical_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    year INTEGER NOT NULL,
    era_id INTEGER REFERENCES eras(id),
    chemist_id INTEGER REFERENCES chemists(id),
    importance_level INTEGER CHECK (importance_level BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 對話歷史（ChatHistory）
```sql
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    chemist_id INTEGER REFERENCES chemists(id),
    user_id INTEGER,  -- 如果之後要加入用戶系統
    message TEXT NOT NULL,
    is_from_user BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 時代（Eras）
```sql
CREATE TABLE eras (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    camera_position_x FLOAT,
    camera_position_y FLOAT,
    camera_position_z FLOAT,
    camera_target_x FLOAT,
    camera_target_y FLOAT,
    camera_target_z FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 索引設計

### 化學家表索引
```sql
CREATE INDEX idx_chemists_era_id ON chemists(era_id);
CREATE INDEX idx_chemists_birth_year ON chemists(birth_year);
```

### 歷史事件表索引
```sql
CREATE INDEX idx_historical_events_year ON historical_events(year);
CREATE INDEX idx_historical_events_era_id ON historical_events(era_id);
CREATE INDEX idx_historical_events_chemist_id ON historical_events(chemist_id);
```

### 對話歷史表索引
```sql
CREATE INDEX idx_chat_history_chemist_id ON chat_history(chemist_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at);
```

## 關聯關係

1. 化學家與時代：多對一關係
   - 一個時代可以有多個化學家
   - 每個化學家屬於一個時代

2. 歷史事件與時代：多對一關係
   - 一個時代可以有多個歷史事件
   - 每個歷史事件屬於一個時代

3. 歷史事件與化學家：多對一關係
   - 一個化學家可以有多個相關的歷史事件
   - 每個歷史事件可以關聯到一個化學家

4. 對話歷史與化學家：多對一關係
   - 一個化學家可以有多條對話記錄
   - 每條對話記錄屬於一個化學家

## 資料範例

### 時代資料範例
```sql
INSERT INTO eras (name, year, description, camera_position_x, camera_position_y, camera_position_z, camera_target_x, camera_target_y, camera_target_z)
VALUES 
('拉瓦錫時代', 1774, '法國化學革命的開始', 10, 5, 10, 0, 0, 0),
('門得列夫時代', 1869, '元素週期表的誕生', 15, 8, 15, 0, 0, 0),
('居里夫人時代', 1898, '放射性元素的發現', 12, 6, 12, 0, 0, 0);
```

### 化學家資料範例
```sql
INSERT INTO chemists (name, birth_year, death_year, bio, portrait_path, model_path, position_x, position_y, position_z, era_id)
VALUES 
('安東尼·拉瓦錫', 1743, 1794, '法國化學家，被稱為現代化學之父', '/portraits/lavoisier.jpg', '/models/lavoisier.glb', 0, 0, 0, 1),
('德米特里·門得列夫', 1834, 1907, '俄羅斯化學家，發現元素週期表', '/portraits/mendeleev.jpg', '/models/mendeleev.glb', 0, 0, 0, 2),
('瑪麗·居里', 1867, 1934, '波蘭裔法國物理學家和化學家，研究放射性', '/portraits/curie.jpg', '/models/curie.glb', 0, 0, 0, 3);
```

## 注意事項

1. 所有表都包含 `created_at` 和 `updated_at` 時間戳，用於追蹤記錄的創建和修改時間
2. 使用外鍵約束確保資料完整性
3. 適當的索引設計以提高查詢效能
4. 所有字串欄位都使用 UTF-8 編碼以支援多語言
5. 數值欄位使用適當的資料類型以節省空間 