import pandas as pd
import json
from django.core.management import BaseCommand
from observation.models import Species


class Command(BaseCommand):
    help = 'Load a bird species csv file into the database'

    def add_arguments(self, parser):
        parser.add_argument('--path', type=str, default='../../generation/data/bird_species.csv')

    def handle(self, *args, **kwargs):
        df = pd.read_csv(kwargs['path'])

        ids = df.scientificName
        duplicates = df[ids.isin(ids[ids.duplicated()])]
        if duplicates.size:
            print("Found duplicates.")
            print(duplicates.sort_values('scientificName'))
            return

        species_create = []
        for row in df.itertuples():
            if Species.objects.filter(scientificNameWithoutAuthor=row.scientificName).exists():
                continue
            species = Species(
                type='bird',
                scientificNameWithoutAuthor=row.scientificName,
                scientificNameAuthorship=row.citation,
                commonNames=[row.name],
                protonyms=[row.protonym] + ([row.species] if row.species != row.scientificName else []),
                genus=row.genus,
                family=row.family,
                avibase_id=row.avibaseId,
                rarity_status=row.status.strip() if not pd.isna(row.status) else '',
                rarity_gpt=row.rarityGpt,
                wikipedia_word_count=row.WikipediaWordCount,
            )
            species_create.append(species)
        self.stdout.write(f'Will create {len(species_create)} species out of {df.shape[0]} datapoints. Continue? [Y/n]')
        yes = set(['yes', 'y', 'Y', ''])
        choice = input().lower()
        if choice not in yes:
            return False
        Species.objects.bulk_create(species_create)
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(species_create)} species')
        )