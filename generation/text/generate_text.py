import argparse
import pandas as pd
import sys
import os
from dotenv import load_dotenv
import openai
import wikipedia
import functools
import multiprocessing

sys.path.append('..')
import nature_go_client
import summary_generation
import summary_prompt
import question_generation



def get_species(client, batch_size=5, ordering=None):
    ordering = ordering.split(',') if ',' in ordering else ordering
    species_list = client.get_labeled_species(multiplechoicequestions=False, descriptions=False, limit=batch_size, ordering=ordering)
    print(f'Found {len(species_list)} species')
    return pd.DataFrame(species_list)

def generate(species, client):
    print('#############################')
    print(f'Starting generation for {species.scientificNameWithoutAuthor}')
    try:
        summary = summary_generation.generate_summaries(common_name=species.display_name, scientific_name=species.scientificNameWithoutAuthor, material=None, prompt=summary_prompt.summary_v7)
    except wikipedia.PageError as e:
        print(e)
        return
    if not all(f'part_{i}' in summary.keys() for i in range(1, 4)):
        print(f'Problem with summary generation for {species.scientificNameWithoutAuthor}: keys: {list(summary.keys())}.')
        return
    print(f'Generated summaries for {species.scientificNameWithoutAuthor}.')
    client.update_species_field(species.id, 'descriptions', [summary['part_1'], summary['part_2'], summary['part_3']])
    print('Uploaded summaries.')
    material = ' '.join([summary['part_1'], summary['part_2'], summary['part_3']])
    questions = question_generation.generate_questions(common_name=species.display_name, scientific_name=species.scientificNameWithoutAuthor, material=material)
    if not questions:
        print(f'Problem with question generation for {species.scientificNameWithoutAuthor}: {questions}.')
        return
    print(f'Generated questions for {species.scientificNameWithoutAuthor}.')
    client.post_species_questions(species.id, questions)
    print('Uploaded questions.')


def main(args):
    load_dotenv()
    NG_USERNAME = os.getenv("NG_USERNAME")
    NG_PASSWORD = os.getenv("NG_PASSWORD")
    openai.api_key = os.getenv("OPENAI_API_KEY")
    client = nature_go_client.NatureGoClient(username=NG_USERNAME, password=NG_PASSWORD)
    client.login()
    
    while True:
        species_batch = get_species(client, batch_size=args.batch_size, ordering=args.ordering)
        species_list = [species for (_, species) in species_batch.iterrows()]
        pool = multiprocessing.Pool(processes=multiprocessing.cpu_count() - 1)
        generate_and_upload = functools.partial(generate, client=client)
        pool.map(generate_and_upload, species_list)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--ordering", help="species ordering", type=str, default='-observation_count,rarity_gpt,-occurences_cdf')
    parser.add_argument("--batch_size", help="batch size", type=int, default=100)
    args = parser.parse_args()
    main(args)