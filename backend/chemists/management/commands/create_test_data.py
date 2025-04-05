from django.core.management.base import BaseCommand
from chemists.models import create_test_data

class Command(BaseCommand):
    help = '創建測試數據'

    def handle(self, *args, **options):
        self.stdout.write('開始創建測試數據...')
        create_test_data()
        self.stdout.write(self.style.SUCCESS('成功創建測試數據！')) 