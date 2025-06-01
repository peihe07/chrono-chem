# 構建階段
FROM python:3.11-slim AS builder

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 複製依賴文件
COPY requirements.txt .

# 創建虛擬環境並安裝依賴
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# 生產環境
FROM python:3.11-slim

WORKDIR /app

# 創建非 root 用戶
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# 安裝系統依賴
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 從構建階段複製虛擬環境
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 創建必要的目錄
RUN mkdir -p /app/staticfiles /app/media && \
    chown -R appuser:appgroup /app

# 複製應用代碼
COPY --chown=appuser:appgroup . .

# 切換到非 root 用戶
USER appuser

# 設置環境變數
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD celery -A config inspect ping -d celery@$HOSTNAME || exit 1

# 啟動命令
CMD ["celery", "-A", "config", "worker", "--loglevel=info"] 