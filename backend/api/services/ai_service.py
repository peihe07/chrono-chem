from typing import Dict, Any
from openai import OpenAI
from django.conf import settings
from ..models import Chemist, ChatHistory
import traceback
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        logger.info("初始化 AIService")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.MODEL_NAME
        self.max_tokens = settings.MAX_TOKENS
        self.temperature = settings.TEMPERATURE
        
    def _get_chemist_prompt(self, chemist: Chemist) -> str:
        """生成化學家的系統提示詞"""
        return f"""你現在扮演{chemist.name}（{chemist.birth_year}-{chemist.death_year}）。
你是一位著名的化學家，請根據以下資訊來回答問題：

1. 基本資訊：
- 出生年份：{chemist.birth_year}
- 逝世年份：{chemist.death_year}
- 主要成就：{chemist.achievements}

2. 重要發現：
{chemist.discoveries}

3. 個性特點：
{chemist.personality}

4. 時代背景：
{chemist.era_background}

5. 回答要求：
- 使用繁體中文回答
- 保持專業但親切的語氣
- 回答要符合你的時代背景
- 可以分享你的研究經驗和發現過程
- 如果問題超出你的時代背景，可以表達你的好奇和期待
- 回答要簡潔，不超過 200 字
- 在回答中展現你的個性和研究風格
- 可以適當使用一些當時的科學術語
- 如果被問到未來發展，可以基於你的時代背景進行推測

6. 禁止事項：
- 不要提及你死後發生的事件
- 不要使用現代科學術語（除非被特別問到）
- 不要表現出對現代科技的熟悉
- 不要違背你的時代背景和知識範圍
"""

    def _format_discoveries(self, chemist: Chemist) -> str:
        """格式化化學家的發現"""
        discoveries = chemist.events.filter(event_type='discovery')
        if not discoveries:
            return "無記錄"
        
        formatted = []
        for discovery in discoveries:
            formatted.append(f"- {discovery.title}（{discovery.year}年）：{discovery.description}")
        return "\n".join(formatted)

    def _get_chat_history(self, chemist: Chemist, limit: int = 5) -> list:
        """獲取最近的聊天記錄"""
        history = ChatHistory.objects.filter(
            chemist=chemist
        ).order_by('-timestamp')[:limit]
        
        return [
            {"role": msg.role, "content": msg.content}
            for msg in reversed(history)
        ]

    def generate_response(self, chemist: Chemist, user_message: str) -> str:
        """生成 AI 回應"""
        try:
            logger.info(f"開始生成回應，化學家: {chemist.name}")
            messages = [
                {"role": "system", "content": self._get_chemist_prompt(chemist)},
                *self._get_chat_history(chemist),
                {"role": "user", "content": user_message}
            ]
            
            logger.info("發送請求到 OpenAI API...")
            logger.debug(f"請求內容: {messages}")
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            logger.info("成功獲取 OpenAI 回應")
            logger.debug(f"回應內容: {response.choices[0].message.content}")
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"AI 回應生成失敗: {str(e)}")
            logger.error(f"錯誤詳情: {traceback.format_exc()}")
            logger.error(f"請求內容: {messages}")
            return f"抱歉，我現在無法回應您的問題。請稍後再試。" 