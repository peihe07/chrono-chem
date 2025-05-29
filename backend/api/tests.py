from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Era, Chemist, HistoricalEvent, ChatHistory
from django.utils import timezone

class EraModelTest(TestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            year=-3000,
            description="化學的起源"
        )

    def test_era_creation(self):
        self.assertTrue(isinstance(self.era, Era))
        self.assertEqual(str(self.era), "古代")

class ChemistModelTest(TestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            year=-3000,
            description="化學的起源"
        )
        self.chemist = Chemist.objects.create(
            name="古代化學家",
            era=self.era,
            description="一位重要的化學家",
            position_x=0,
            position_y=0,
            position_z=0,
            birth_year=-3100,
            death_year=-3050,
            bio="一位重要的化學家"
        )

    def test_chemist_creation(self):
        self.assertTrue(isinstance(self.chemist, Chemist))
        self.assertEqual(str(self.chemist), "古代化學家")

class EventModelTest(TestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            year=-3000,
            description="化學的起源"
        )
        self.chemist = Chemist.objects.create(
            name="古代化學家",
            era=self.era,
            description="一位重要的化學家",
            position_x=0,
            position_y=0,
            position_z=0,
            birth_year=-3100,
            death_year=-3050,
            bio="一位重要的化學家"
        )
        self.event = HistoricalEvent.objects.create(
            title="重要發現",
            description="一個重要的歷史發現",
            location="古代實驗室",
            experiment_description="一個重要的實驗",
            date=timezone.now().date(),
            era=self.era
        )

    def test_event_creation(self):
        self.assertTrue(isinstance(self.event, HistoricalEvent))
        self.assertEqual(str(self.event), f"重要發現 ({self.event.date})")

class EraViewTest(APITestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            year=-3000,
            description="化學的起源"
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
            year=-3000,
            description="化學的起源"
        )
        self.event = HistoricalEvent.objects.create(
            title="重要發現",
            description="一個重要的歷史發現",
            location="古代實驗室",
            experiment_description="一個重要的實驗",
            date=timezone.now().date(),
            era=self.era
        )

    def test_get_event_list(self):
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "重要發現")

    def test_get_event_detail(self):
        url = reverse('event-detail', args=[self.event.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "重要發現")

class ScientistViewTest(APITestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            year=-3000,
            description="化學的起源"
        )
        self.chemist = Chemist.objects.create(
            name="古代化學家",
            era=self.era,
            description="一位重要的化學家",
            position_x=0,
            position_y=0,
            position_z=0,
            birth_year=-3100,
            death_year=-3050,
            bio="一位重要的化學家"
        )

    def test_get_scientist_list(self):
        url = reverse('chemist-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "古代化學家")

    def test_get_scientist_detail(self):
        url = reverse('chemist-detail', args=[self.chemist.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "古代化學家") 