import pandas as pd
import json
from django.core.management import BaseCommand
from observation.models import Species


class Command(BaseCommand):
    help = 'Load a species csv file into the database'

    def add_arguments(self, parser):
        parser.add_argument('--path', type=str, default='../../generation/data/species.csv')

    def handle(self, *args, **kwargs):
        df = pd.read_csv(kwargs['path'])

        ids = df.scientificNameWithoutAuthor
        duplicates = df[ids.isin(ids[ids.duplicated()])]
        if duplicates.size:
            print("Found duplicates.")
            print(duplicates.sort_values('scientificNameWithoutAuthor'))
            return

        species_create = []
        for row in df.itertuples():
            if Species.objects.filter(scientificNameWithoutAuthor=row.scientificNameWithoutAuthor).exists():
                continue
            species = Species(
                scientificNameWithoutAuthor=row.scientificNameWithoutAuthor,
                scientificNameAuthorship=row.scientificNameAuthorship,
                commonNames=json.loads(row.commonNames),
                genus=row.genus,
                family=row.family,
                gbif_id=row.gbifId,
                powo_id=row.powoId,
                wikipedia_word_count=row.WikipediaWordCount,
                number_of_occurrences=row.numberOfOccurrences,
                occurences_cdf=row.occurrencesCdf,
                rarity_gpt=row.rarityGpt,
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