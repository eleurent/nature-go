# Generated by Django 4.2.2 on 2023-09-08 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('observation', '0019_alter_species_scientificname_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='observation',
            name='xp',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
