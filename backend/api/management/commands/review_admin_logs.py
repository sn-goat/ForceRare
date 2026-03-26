from django.core.management.base import BaseCommand
from django.contrib.admin.models import LogEntry

class Command(BaseCommand):
    help = "Review admin logs"

    def handle(self, *args, **kwargs):
        logs = LogEntry.objects.all()
        for log in logs:
            self.stdout.write(
                f"User: {log.user}, Time: {log.action_time}, "
                f"Object: {log.object_repr}, Change: {log.change_message}"
            )