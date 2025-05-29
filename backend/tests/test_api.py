from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import Era, HistoricalEvent

class EraAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.era = Era.objects.create(
            name='啟蒙時代',
            year=1774,
            description='化學革命的開始',
            model_url='https://example.com/models/lab_1774.glb',
            soundtrack_url='https://example.com/sounds/lab_1774.mp3'
        )
        self.event = HistoricalEvent.objects.create(
            era=self.era,
            title='發現氧氣',
            description='普利斯特里發現氧氣',
            location='英國利茲',
            experiment_description='使用凸透鏡加熱氧化汞',
            date='1774-08-01'
        )

    def test_get_era_list(self):
        url = reverse('era-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_era_detail(self):
        url = reverse('era-detail', args=[self.era.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], '啟蒙時代')

    def test_get_era_full_detail(self):
        url = reverse('era-detail-detail', args=[self.era.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], '啟蒙時代')
        self.assertEqual(len(response.data['events']), 1)
        self.assertEqual(response.data['events'][0]['title'], '發現氧氣') 