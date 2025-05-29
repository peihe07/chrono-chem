import os
from dotenv import load_dotenv
from openai import OpenAI

# 載入環境變數
load_dotenv()

# 獲取 API 金鑰
api_key = os.getenv('OPENAI_API_KEY')

if not api_key:
    print("錯誤：找不到 OPENAI_API_KEY 環境變數")
    exit(1)

# 初始化 OpenAI 客戶端
client = OpenAI(api_key=api_key)

try:
    # 測試 API 連接
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "你是一個測試助手。"},
            {"role": "user", "content": "你好"}
        ],
        max_tokens=10
    )
    print("API 金鑰驗證成功！")
    print(f"回應：{response.choices[0].message.content}")
except Exception as e:
    print(f"API 金鑰驗證失敗：{str(e)}") 