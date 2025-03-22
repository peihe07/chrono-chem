# 構建階段
FROM python:3.11-slim as builder

WORKDIR /app

# 安裝構建工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 複製依賴文件
COPY requirements.txt .

# 創建虛擬環境並安裝依賴
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# 生產階段
FROM python:3.11-slim

WORKDIR /app

# 複製虛擬環境
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 複製應用代碼
COPY . .

# 設置環境變量
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# 暴露端口
EXPOSE 8000

# 啟動應用
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"] 