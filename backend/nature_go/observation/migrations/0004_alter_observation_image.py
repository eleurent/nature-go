# Generated by Django 4.2.2 on 2023-06-17 11:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('observation', '0003_alter_observation_image_alter_observation_species'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='image',
            field=models.ImageField(upload_to='observation_images'),
        ),
    ]
