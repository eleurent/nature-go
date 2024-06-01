import argparse
import pandas as pd
import sys
import os
from dotenv import load_dotenv
import wikipedia
import functools
import multiprocessing

sys.path.extend(['..', '../..'])
import nature_go_client
from backend.nature_go.generation import gemini
from backend.nature_go.generation import description_generation
from backend.nature_go.generation import question_generation


load_dotenv()
NATURE_GO_USERNAME = os.getenv("NATURE_GO_USERNAME")
NATURE_GO_PASSWORD = os.getenv("NATURE_GO_PASSWORD")


def get_species(client: nature_go_client.NatureGoClient, batch_size=5, ordering=None, type=None):
    ordering = ordering.split(',') if ',' in ordering else ordering
    species_list = client.get_labeled_species(multiplechoicequestions=False, descriptions=None, limit=batch_size, ordering=ordering, type=type)
    print(f'Found {len(species_list)} species')
    return pd.DataFrame(species_list)

def generate(species, client):
    print('#############################')
    print(f'Starting generation for {species.scientificNameWithoutAuthor}')
    try:
        summary, _ = description_generation.generate_descriptions(generate_text=gemini.generate_text, species=species, material=None)
    except wikipedia.PageError as e:
        print(e)
        return
    if not len(summary) == 3:
        print(f'Problem with summary generation for {species.scientificNameWithoutAuthor}: summary: {summary}.')
        return
    print(f'Generated summaries for {species.scientificNameWithoutAuthor}.')
    client.update_species_field(species.id, 'descriptions', summary)
    print('Uploaded summaries.')
    material = '\n '.join(summary)
    questions, _ = question_generation.generate_questions(generate_text=gemini.generate_text, species=species, material=material)
    if not questions:
        print(f'Problem with question generation for {species.scientificNameWithoutAuthor}: {questions}.')
        return
    print(f'Generated questions for {species.scientificNameWithoutAuthor}.')
    client.post_species_questions(species.id, questions)
    print('Uploaded questions.')


def main(args):
    gemini.configure()
    client = nature_go_client.NatureGoClient(username=NATURE_GO_USERNAME, password=NATURE_GO_PASSWORD)
    client.login()
    
    species_list = None
    while species_list or (species_list is None):
        species_batch = get_species(client, batch_size=args.batch_size, ordering=args.ordering, type=args.type)
        species_list = [species for (_, species) in species_batch.iterrows()]
        pool = multiprocessing.Pool(processes=multiprocessing.cpu_count() - 1)
        generate_and_upload = functools.partial(generate, client=client)
        pool.map(generate_and_upload, species_list)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--ordering", help="species ordering", type=str, default='-observation_count,rarity_gpt,-occurences_cdf')
    parser.add_argument("--batch_size", help="batch size", type=int, default=1)
    parser.add_argument("--type", help="species type (bird|plant)", type=str, default="bird")
    args = parser.parse_args()
    main(args)