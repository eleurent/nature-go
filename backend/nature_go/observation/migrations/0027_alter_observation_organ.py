# Generated by Django 4.2.6 on 2023-10-15 11:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("observation", "0026_observation_organ"),
    ]

    operations = [
        migrations.AlterField(
            model_name="observation",
            name="organ",
            field=models.CharField(
                choices=[
                    ("leaf", "leaf"),
                    ("flower", "flower"),
                    ("fruit", "fruit"),
                    ("bark", "bark"),
                ],
                max_length=10,
            ),
        ),
    ]