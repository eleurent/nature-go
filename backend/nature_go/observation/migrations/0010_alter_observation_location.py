# Generated by Django 4.2.2 on 2023-07-20 22:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('observation', '0009_alter_species_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='location',
            field=models.JSONField(default=dict),
        ),
    ]
