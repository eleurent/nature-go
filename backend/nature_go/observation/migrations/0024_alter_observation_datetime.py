# Generated by Django 4.2.5 on 2023-09-29 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('observation', '0023_alter_species_scientificnamewithoutauthor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='datetime',
            field=models.DateTimeField(),
        ),
    ]