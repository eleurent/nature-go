# Generated by Django 4.2.6 on 2024-06-15 22:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("badge", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="badge",
            name="badge_type",
        ),
        migrations.RemoveField(
            model_name="badge",
            name="icon",
        ),
        migrations.RemoveField(
            model_name="badge",
            name="species_list",
        ),
    ]