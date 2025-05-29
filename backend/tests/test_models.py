from django.test import TestCase
from django.utils import timezone
from models import Era, HistoricalEvent

class EraModelTest(TestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name='啟蒙時代',
            year=1774,
            description='化學革命的開始',
            model_url='https://example.com/models/lab_1774.glb',
            soundtrack_url='https://example.com/sounds/lab_1774.mp3'
        )

    def test_era_creation(self):
        self.assertEqual(self.era.name, '啟蒙時代')
        self.assertEqual(self.era.year, 1774)
        self.assertTrue(isinstance(self.era, Era))
        self.assertEqual(str(self.era), '啟蒙時代 (1774)')

class HistoricalEventModelTest(TestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name='啟蒙時代',
            year=1774,
            description='化學革命的開始'
        )
        self.event = HistoricalEvent.objects.create(
            era=self.era,
            title='發現氧氣',
            description='普利斯特里發現氧氣',
            location='英國利茲',
            experiment_description='使用凸透鏡加熱氧化汞',
            date=timezone.now().date()
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, '發現氧氣')
        self.assertEqual(self.event.era, self.era)
        self.assertTrue(isinstance(self.event, HistoricalEvent))
        self.assertEqual(str(self.event), f'發現氧氣 ({self.event.date})') 