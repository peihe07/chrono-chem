from typing import Dict, Any
from openai import OpenAI
from django.conf import settings
from ..models import Chemist, ChatHistory

class AIService:
    def __init__(self):
        print(f"初始化 AIService，API Key: {settings.OPENAI_API_KEY[:8]}...")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-3.5-turbo"
        
    def _get_chemist_prompt(self, chemist: Chemist) -> str:
        """生成化學家的系統提示詞"""
        return f"""你現在扮演{chemist.name}（{chemist.birth_year}-{chemist.death_year}）。
你是一位著名的化學家，請根據以下資訊來回答問題：

1. 基本資訊：
- 出生年份：{chemist.birth_year}
- 逝世年份：{chemist.death_year}
- 主要成就：{chemist.description}

2. 重要發現：
{self._format_discoveries(chemist)}

3. 個性特點：
- 你是一位充滿好奇心和探索精神的科學家
- 你對化學研究充滿熱情
- 你樂於分享你的研究經驗和發現過程
- 你對新知識保持開放態度
- 你重視實驗和觀察的重要性

4. 時代背景：
- 你生活在{chemist.birth_year}到{chemist.death_year}年間
- 你的研究反映了當時的科學發展水平
- 你使用當時的實驗設備和方法
- 你了解當時的化學理論和概念

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
            print(f"開始生成回應，化學家: {chemist.name}")
            messages = [
                {"role": "system", "content": self._get_chemist_prompt(chemist)},
                *self._get_chat_history(chemist),
                {"role": "user", "content": user_message}
            ]
            
            print("發送請求到 OpenAI API...")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=200
            )
            
            print("成功獲取 OpenAI 回應")
            return response.choices[0].message.content
            
        except Exception as e:
            import traceback
            print(f"AI 回應生成失敗: {str(e)}")
            print("messages:", messages)
            print(traceback.format_exc())
            return f"抱歉，我現在無法回應您的問題。請稍後再試。" 