import pandas as pd
from django.core.management import BaseCommand
from observation.models import Species


class Command(BaseCommand):
    help = 'Load a species csv file into the database'

    def add_arguments(self, parser):
        parser.add_argument('--path', type=str)

    def handle(self, *args, **kwargs):
        df = pd.read_csv(kwargs['path'])
        df.sort_values(by='cdfOccurences', ascending=False)
        df = df.iloc[:1000]
        species_create = []
        for row in df.itertuples():
            if Species.objects.filter(scientificName=row.scientificName).exists():
                continue
            species = Species(
                scientificName=row.scientificName,
                scientificNameWithoutAuthor=row.species,
                genus=row.genus,
                family=row.family,
                occurences_cdf=row.cdfOccurences,
            )
            species_create.append(species)
        self.stdout.write(f'Will create {len(species_create)} species out of {df.shape[0]} datapoints')
        Species.objects.bulk_create(species_create)
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(species_create)} species')
        )