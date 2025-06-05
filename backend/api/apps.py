from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    verbose_name = '化學時光機 API'

    def ready(self):
        try:
            from .services.ai_service import AIService
            # 初始化 AIService
            AIService()
            logger.info("API 應用程式初始化完成")
        except Exception as e:
            logger.error(f"API 應用程式初始化失敗: {str(e)}")
