# Generated by Django 4.2.2 on 2023-09-03 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('observation', '0014_species_descriptions_species_illustration_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='image',
            field=models.ImageField(upload_to='observation/image'),
        ),
        migrations.AlterField(
            model_name='species',
            name='illustration',
            field=models.ImageField(blank=True, upload_to='species/illustration'),
        ),
        migrations.AlterField(
            model_name='species',
            name='illustration_transparent',
            field=models.ImageField(blank=True, upload_to='species/illustration_transparent'),
        ),
    ]
