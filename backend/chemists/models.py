from django.db import models
from django.utils import timezone

class Chemist(models.Model):
    name = models.CharField(max_length=100, verbose_name="姓名")
    era = models.CharField(max_length=50, verbose_name="時代")
    description = models.TextField(verbose_name="描述")
    position_x = models.FloatField(default=0, verbose_name="X座標")
    position_y = models.FloatField(default=0, verbose_name="Y座標")
    position_z = models.FloatField(default=0, verbose_name="Z座標")
    model_path = models.CharField(max_length=200, verbose_name="3D模型路徑")

    class Meta:
        verbose_name = "化學家"
        verbose_name_plural = "化學家"

    def __str__(self):
        return self.name

class ChatHistory(models.Model):
    chemist = models.ForeignKey(Chemist, on_delete=models.CASCADE, related_name='chat_history', verbose_name="化學家")
    role = models.CharField(max_length=50, verbose_name="角色")
    content = models.TextField(verbose_name="內容")
    timestamp = models.DateTimeField(default=timezone.now, verbose_name="時間戳")

    class Meta:
        verbose_name = "聊天記錄"
        verbose_name_plural = "聊天記錄"
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.chemist.name} - {self.timestamp}"

def create_test_data():
    """創建測試數據"""
    # 創建化學家
    chemist1 = Chemist.objects.create(
        name="安東尼·拉瓦錫",
        era="1774",
        description="法國化學家，被稱為現代化學之父。他發現了氧氣在燃燒中的作用，並建立了質量守恆定律。",
        position_x=0,
        position_y=0,
        position_z=0,
        model_path="models/lavoisier.glb"
    )
    
    chemist2 = Chemist.objects.create(
        name="德米特里·門捷列夫",
        era="1869",
        description="俄羅斯化學家，創建了元素週期表，為現代化學奠定了基礎。",
        position_x=2,
        position_y=0,
        position_z=0,
        model_path="models/mendeleev.glb"
    )
    
    chemist3 = Chemist.objects.create(
        name="瑪麗·居里",
        era="1898",
        description="波蘭裔法國物理學家和化學家，發現了鐳和釙元素，是第一位獲得諾貝爾獎的女性。",
        position_x=-2,
        position_y=0,
        position_z=0,
        model_path="models/curie.glb"
    )
    
    # 創建一些聊天記錄
    ChatHistory.objects.create(
        chemist=chemist1,
        role="assistant",
        content="您好！我是安東尼·拉瓦錫。我很高興能與您討論化學的奧秘。",
        timestamp=timezone.now()
    )
    
    ChatHistory.objects.create(
        chemist=chemist2,
        role="assistant",
        content="歡迎！我是門捷列夫。讓我們一起探索元素週期表的奧秘吧！",
        timestamp=timezone.now()
    )
    
    ChatHistory.objects.create(
        chemist=chemist3,
        role="assistant",
        content="你好！我是瑪麗·居里。我對放射性元素的研究很感興趣，您想了解什麼呢？",
        timestamp=timezone.now()
    ) 