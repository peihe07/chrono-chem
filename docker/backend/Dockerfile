# 構建階段
FROM python:3.11-slim AS builder

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
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
    && rm -rf /var/lib/apt/lists/*

# 從構建階段複製虛擬環境
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 複製應用代碼
COPY . .

# 設置用戶權限
RUN chown -R appuser:appgroup /app

# 切換到非 root 用戶
USER appuser

# 暴露端口
EXPOSE 8001

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:8001/api/health/ || exit 1

# 啟動命令
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "--workers", "4", "--timeout", "120", "config.wsgi:application"] 