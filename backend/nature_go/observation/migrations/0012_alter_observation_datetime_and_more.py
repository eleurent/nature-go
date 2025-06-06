# Generated by Django 4.2.2 on 2023-07-20 23:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('observation', '0011_remove_observation_date_observation_datetime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='datetime',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='observation',
            name='location',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
