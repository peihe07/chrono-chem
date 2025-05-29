#!/bin/bash

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 顯示幫助信息
show_help() {
    echo -e "${GREEN}ChronoChem 開發腳本${NC}"
    echo "用法: ./dev.sh [選項]"
    echo
    echo "選項:"
    echo "  -h, --help     顯示幫助信息"
    echo "  -d, --dev      啟動開發環境"
    echo "  -p, --prod     啟動生產環境"
    echo "  -b, --build    重新構建所有服務"
    echo "  -l, --logs     顯示所有服務的日誌"
    echo "  -s, --stop     停止所有服務"
    echo "  -c, --clean    清理所有容器和卷"
    echo "  -m, --models   下載/更新 3D 模型"
    echo "  -t, --test     運行測試"
    echo "  -e, --editor   啟動場景編輯器"
}

# 啟動開發環境
start_dev() {
    echo -e "${YELLOW}啟動開發環境...${NC}"
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
    echo -e "${GREEN}開發環境已啟動${NC}"
    echo -e "前端: ${BLUE}http://localhost:3000${NC}"
    echo -e "後端: ${BLUE}http://localhost:8001${NC}"
    echo -e "場景編輯器: ${BLUE}http://localhost:3000/editor${NC}"
}

# 啟動生產環境
start_prod() {
    echo -e "${YELLOW}啟動生產環境...${NC}"
    docker-compose up -d
    echo -e "${GREEN}生產環境已啟動${NC}"
}

# 重新構建服務
build_services() {
    echo -e "${YELLOW}重新構建所有服務...${NC}"
    docker-compose build
    echo -e "${GREEN}服務構建完成${NC}"
}

# 顯示日誌
show_logs() {
    echo -e "${YELLOW}顯示服務日誌...${NC}"
    docker-compose logs -f
}

# 停止服務
stop_services() {
    echo -e "${YELLOW}停止所有服務...${NC}"
    docker-compose down
    echo -e "${GREEN}服務已停止${NC}"
}

# 清理環境
clean_environment() {
    echo -e "${YELLOW}清理環境...${NC}"
    docker-compose down -v
    docker system prune -f
    echo -e "${GREEN}環境已清理${NC}"
}

# 下載/更新 3D 模型
update_models() {
    echo -e "${YELLOW}更新 3D 模型...${NC}"
    if [ ! -d "frontend/public/models" ]; then
        mkdir -p frontend/public/models
    fi
    
    # 下載預設模型
    echo -e "${BLUE}下載預設實驗室模型...${NC}"
    curl -L "https://example.com/models/lab.gltf" -o frontend/public/models/lab.gltf
    
    echo -e "${BLUE}下載化學家模型...${NC}"
    curl -L "https://example.com/models/chemists.zip" -o frontend/public/models/chemists.zip
    unzip -o frontend/public/models/chemists.zip -d frontend/public/models/
    rm frontend/public/models/chemists.zip
    
    echo -e "${GREEN}3D 模型更新完成${NC}"
}

# 運行測試
run_tests() {
    echo -e "${YELLOW}運行測試...${NC}"
    
    # 前端測試
    echo -e "${BLUE}運行前端測試...${NC}"
    docker-compose exec frontend npm run test
    
    # 後端測試
    echo -e "${BLUE}運行後端測試...${NC}"
    docker-compose exec backend pytest
    
    echo -e "${GREEN}測試完成${NC}"
}

# 啟動場景編輯器
start_editor() {
    echo -e "${YELLOW}啟動場景編輯器...${NC}"
    docker-compose exec frontend npm run editor
}

# 主程序
case "$1" in
    -h|--help)
        show_help
        ;;
    -d|--dev)
        start_dev
        ;;
    -p|--prod)
        start_prod
        ;;
    -b|--build)
        build_services
        ;;
    -l|--logs)
        show_logs
        ;;
    -s|--stop)
        stop_services
        ;;
    -c|--clean)
        clean_environment
        ;;
    -m|--models)
        update_models
        ;;
    -t|--test)
        run_tests
        ;;
    -e|--editor)
        start_editor
        ;;
    *)
        echo -e "${RED}錯誤：未知選項${NC}"
        show_help
        exit 1
        ;;
esac 