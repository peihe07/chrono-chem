from django.db import models
from django.utils import timezone

class Era(models.Model):
    name = models.CharField(max_length=100, verbose_name='時代名稱', default='未命名時代')
    year = models.IntegerField(verbose_name='年份', default=0)
    description = models.TextField(verbose_name='描述', blank=True)
    camera_position_x = models.FloatField(verbose_name='相機位置X', default=10)
    camera_position_y = models.FloatField(verbose_name='相機位置Y', default=5)
    camera_position_z = models.FloatField(verbose_name='相機位置Z', default=10)
    camera_target_x = models.FloatField(verbose_name='相機目標X', default=0)
    camera_target_y = models.FloatField(verbose_name='相機目標Y', default=0)
    camera_target_z = models.FloatField(verbose_name='相機目標Z', default=0)
    created_at = models.DateTimeField(default=timezone.now, verbose_name='創建時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        verbose_name = '時代'
        verbose_name_plural = '時代'
        ordering = ['year']

    def __str__(self):
        return f"{self.name} ({self.year})"

class Chemist(models.Model):
    name = models.CharField(max_length=100, verbose_name='姓名', default='未命名化學家')
    birth_year = models.IntegerField(verbose_name='出生年份', default=0)
    death_year = models.IntegerField(verbose_name='逝世年份', null=True, blank=True)
    bio = models.TextField(verbose_name='簡介', blank=True)
    portrait_path = models.CharField(max_length=255, verbose_name='肖像路徑', blank=True)
    model_path = models.CharField(max_length=255, verbose_name='模型路徑', blank=True)
    position_x = models.FloatField(verbose_name='位置X', default=0)
    position_y = models.FloatField(verbose_name='位置Y', default=0)
    position_z = models.FloatField(verbose_name='位置Z', default=0)
    era = models.ForeignKey(Era, on_delete=models.CASCADE, related_name='chemists', verbose_name='所屬時代')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='創建時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        verbose_name = '化學家'
        verbose_name_plural = '化學家'
        ordering = ['birth_year']
        indexes = [
            models.Index(fields=['era']),
            models.Index(fields=['birth_year']),
        ]

    def __str__(self):
        return self.name

class HistoricalEvent(models.Model):
    title = models.CharField(max_length=200, verbose_name='標題', default='未命名事件')
    description = models.TextField(verbose_name='描述', blank=True)
    year = models.IntegerField(verbose_name='年份', default=0)
    era = models.ForeignKey(Era, on_delete=models.CASCADE, related_name='events', verbose_name='所屬時代')
    chemist = models.ForeignKey(Chemist, on_delete=models.CASCADE, related_name='events', verbose_name='相關化學家')
    importance_level = models.IntegerField(verbose_name='重要程度', choices=[(i, str(i)) for i in range(1, 6)], default=1)
    created_at = models.DateTimeField(default=timezone.now, verbose_name='創建時間')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新時間')

    class Meta:
        verbose_name = '歷史事件'
        verbose_name_plural = '歷史事件'
        ordering = ['year']
        indexes = [
            models.Index(fields=['year']),
            models.Index(fields=['era']),
            models.Index(fields=['chemist']),
        ]

    def __str__(self):
        return f"{self.title} ({self.year})"

class ChatHistory(models.Model):
    chemist = models.ForeignKey(Chemist, on_delete=models.CASCADE, related_name='chat_history', verbose_name='化學家')
    user_id = models.IntegerField(verbose_name='用戶ID', null=True, blank=True)
    message = models.TextField(verbose_name='訊息', default='')
    is_from_user = models.BooleanField(verbose_name='是否來自用戶', default=True)
    created_at = models.DateTimeField(default=timezone.now, verbose_name='創建時間')

    class Meta:
        verbose_name = '對話歷史'
        verbose_name_plural = '對話歷史'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['chemist']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{'用戶' if self.is_from_user else '化學家'} - {self.created_at}"