from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

class Era(models.Model):
    """化學時代模型"""
    name = models.CharField(_('時代名稱'), max_length=100, default='')
    year = models.IntegerField(_('年份'), default=0)
    description = models.TextField(_('時代描述'), default='')
    model_url = models.URLField(_('3D 模型 URL'), blank=True, default='')
    soundtrack_url = models.URLField(_('背景音效 URL'), blank=True, default='')
    created_at = models.DateTimeField(_('建立時間'), auto_now_add=True)
    updated_at = models.DateTimeField(_('更新時間'), auto_now=True)

    class Meta:
        verbose_name = _('時代')
        verbose_name_plural = _('時代')
        ordering = ['year']

    def __str__(self):
        return f"{self.name} ({self.year})"

class Chemist(models.Model):
    name = models.CharField(max_length=100, verbose_name="姓名", default='')
    era = models.IntegerField(verbose_name="時代", default=0)
    description = models.TextField(verbose_name="描述", default='')
    position_x = models.FloatField(default=0, verbose_name="X座標")
    position_y = models.FloatField(default=0, verbose_name="Y座標")
    position_z = models.FloatField(default=0, verbose_name="Z座標")
    model_path = models.CharField(max_length=200, verbose_name="3D模型路徑", default='')
    birth_year = models.IntegerField(verbose_name="出生年份", default=1800)
    death_year = models.IntegerField(verbose_name="死亡年份", null=True, blank=True)
    portrait_path = models.CharField(max_length=200, verbose_name="肖像路徑", null=True, blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now, verbose_name="創建時間")
    updated_at = models.DateTimeField(default=timezone.now, verbose_name="更新時間")

    class Meta:
        verbose_name = "化學家"
        verbose_name_plural = "化學家"

    def __str__(self):
        return self.name

class HistoricalEvent(models.Model):
    title = models.CharField(max_length=200, verbose_name="事件標題", default='')
    description = models.TextField(verbose_name="事件描述", default='')
    year = models.IntegerField(verbose_name="發生年份", default=0)
    chemist = models.ForeignKey(Chemist, on_delete=models.CASCADE, related_name='events', verbose_name="相關化學家")
    event_type = models.CharField(max_length=50, verbose_name="事件類型", choices=[
        ('discovery', '重要發現'),
        ('invention', '重要發明'),
        ('publication', '重要著作'),
        ('award', '重要獎項'),
        ('other', '其他')
    ], default='other')
    image_path = models.CharField(max_length=200, verbose_name="事件圖片路徑", null=True, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="創建時間")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新時間")

    class Meta:
        verbose_name = "歷史事件"
        verbose_name_plural = "歷史事件"
        ordering = ['year']

    def __str__(self):
        return f"{self.year} - {self.title}"

class ChatHistory(models.Model):
    chemist = models.ForeignKey(Chemist, on_delete=models.CASCADE, related_name='chat_history', verbose_name="化學家")
    role = models.CharField(max_length=50, verbose_name="角色", default="")
    content = models.TextField(verbose_name="內容", default="")
    timestamp = models.DateTimeField(default=timezone.now, verbose_name="時間戳")

    class Meta:
        verbose_name = "聊天記錄"
        verbose_name_plural = "聊天記錄"
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.chemist.name} - {self.timestamp}"

class UserFeedback(models.Model):
    chemist = models.ForeignKey('Chemist', on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.chemist.name} - {self.rating}星評價"

def create_test_data():
    """創建測試數據"""
    # 創建化學家
    chemist1 = Chemist.objects.create(
        name="安東尼·拉瓦錫",
        era=1774,
        description="法國化學家，被譽為「現代化學之父」，他徹底改變了人類對化學反應的理解。\n拉瓦錫最著名的貢獻是推翻了「燃素說」，並提出燃燒其實是一種與氧氣結合的反應。\n他首創化學反應的質量守恆定律：「在一個封閉系統中，反應前後的總質量保持不變」，為化學計算奠定基礎。\n拉瓦錫不僅是實驗科學家，也是一位制度改革者，推動標準化化學命名法，使化學語言更加科學與一致。\n不幸的是，他在法國大革命期間被處以死刑，但他的科學遺產至今仍深深影響著化學世界。",
        position_x=0,
        position_y=0,
        position_z=0,
        model_path="models/lavoisier.glb",
        birth_year=1743,
        death_year=1827,
        portrait_path="portraits/lavoisier.jpg"
    )
    
    chemist2 = Chemist.objects.create(
        name="德米特里·門捷列夫",
        era=1869,
        description="俄羅斯化學家，被譽為元素週期表之父。\n他在1869年提出了第一張有系統的元素週期表，將已知元素按照原子量大小與化學性質週期性排列。\n令人驚訝的是，他大膽地預測了當時尚未發現的元素及其性質，如鍺、鎵與鍶，後來的實驗也證實了他的預測準確無誤。",
        position_x=2,
        position_y=0,
        position_z=0,
        model_path="models/mendeleev.glb",
        birth_year=1834,
        death_year=1907,
        portrait_path="portraits/mendeleev.jpg"
    )
    
    chemist3 = Chemist.objects.create(
        name="瑪麗·居里",
        era=1898,
        description="波蘭裔法國物理學家和化學家，以對放射性現象的開創性研究聞名於世。\n她是歷史上第一位獲得諾貝爾獎的女性，也是唯一一位同時獲得物理學獎(1903)與化學獎(1911)的科學家。\n瑪麗·居里與丈夫皮埃爾·居里一同發現了釙（Polonium）與鐳（Radium）兩種放射性元素，並開創了放射化學這個全新領域。",
        position_x=-2,
        position_y=0,
        position_z=0,
        model_path="models/curie.glb",
        birth_year=1867,
        death_year=1934,
        portrait_path="portraits/curie.jpg"
    )

    chemist4 = Chemist.objects.create(
        name="羅伯特·波義耳",
        era=1,
        description="愛爾蘭化學家，被稱為現代化學的奠基人之一。他提出了波義耳定律，並首次將化學定義為一門科學。",
        position_x=0,
        position_y=0,
        position_z=0,
        model_path="models/boyle.glb",
        birth_year=1627,
        death_year=1691,
        portrait_path="portraits/boyle.jpg"
    )
    
    # 創建歷史事件
    HistoricalEvent.objects.create(
        title="發現氧氣",
        description="拉瓦錫通過實驗證明了氧氣在燃燒中的作用，推翻了燃素說。",
        year=1774,
        chemist=chemist1,
        event_type="discovery",
        image_path="events/oxygen_discovery.jpg"
    )
    
    HistoricalEvent.objects.create(
        title="發表元素週期表",
        description="門捷列夫發表了第一版元素週期表，預測了多個尚未發現的元素。",
        year=1869,
        chemist=chemist2,
        event_type="publication",
        image_path="events/periodic_table.jpg"
    )
    
    HistoricalEvent.objects.create(
        title="發現鐳元素",
        description="居里夫婦發現了鐳元素，為放射性研究開創了新紀元。",
        year=1898,
        chemist=chemist3,
        event_type="discovery",
        image_path="events/radium_discovery.jpg"
    )

    HistoricalEvent.objects.create(
        title="發表波義耳定律",
        description="波義耳發現了氣體壓強與體積的關係，為現代氣體化學奠定了基礎。",
        year=1662,
        chemist=chemist4,
        event_type="discovery",
        image_path="events/boyle_law.jpg"
    )
    
    # 創建聊天記錄
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

    ChatHistory.objects.create(
        chemist=chemist4,
        role="assistant",
        content="您好！我是羅伯特·波義耳。讓我們一起探索氣體化學的奧秘吧！",
        timestamp=timezone.now()
    )