from django.test import TestCase
from api.models import Era, Event, Scientist

class EraModelTest(TestCase):
    def setUp(self):
        self.era = Era.objects.create(
            name="古代",
            start_year=-3000,
            end_year=-1000,
            description="古代文明時期",
            model_path="models/ancient.glb"
        )

    def test_era_creation(self):
        self.assertTrue(isinstance(self.era, Era))
        self.assertEqual(str(self.era), "古代")
        self.assertEqual(self.era.start_year, -3000)

class EventModelTest(TestCase):
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

    def test_event_creation(self):
        self.assertTrue(isinstance(self.event, Event))
        self.assertEqual(str(self.event), "重要發現")
        self.assertEqual(self.event.year, -2500)

class ScientistModelTest(TestCase):
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

    def test_scientist_creation(self):
        self.assertTrue(isinstance(self.scientist, Scientist))
        self.assertEqual(str(self.scientist), "古代科學家")
        self.assertEqual(self.scientist.birth_year, -2600) 