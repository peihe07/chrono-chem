from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Era, Event, Scientist

class EraViewTest(APITestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            start_year=-3000,
            end_year=-1000,
            description="古代文明時期",
            model_path="models/ancient.glb"
        )

    def test_get_era_list(self):
        url = reverse('era-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "古代")

    def test_get_era_detail(self):
        url = reverse('era-detail', args=[self.era.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "古代")

class EventViewTest(APITestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            start_year=-3000,
            end_year=-1000
        )
        self.event = Event.objects.create(
            title="重要發現",
            description="一個重要的歷史發現",
            year=-2500,
            era=self.era
        )

    def test_get_event_list(self):
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "重要發現")

class ScientistViewTest(APITestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            start_year=-3000,
            end_year=-1000
        )
        self.scientist = Scientist.objects.create(
            name="古代科學家",
            biography="一位重要的科學家",
            birth_year=-2600,
            death_year=-2500,
            era=self.era
        )

    def test_get_scientist_list(self):
        url = reverse('scientist-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "古代科學家") 