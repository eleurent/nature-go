import sys
import os
from dotenv import load_dotenv
sys.path.extend(['..', '../..'])
from backend.nature_go.generation import gemini

from rarity_prompts import rarity_batch_bird_v2

FILENAME = "../data/bird_species.csv"
DF_FIELD_NAME = "name"
BATCH_SIZE = 100

import typing as tp
import json


def generate_rarity_batch(species_names, generate_text: tp.Callable = gemini.generate_text, prompt: str = rarity_batch_bird_v2):
    prompt = prompt.format(species_names=species_names)
    try:
        response = generate_text(contents=[prompt])
    except ValueError as e:
        print(e)
        return {}
    data = json.loads(response)
    return data, response


def generate_rarity_all(filename: str, repeats: int = 5):
    from tqdm import tqdm
    import pandas as pd
    import numpy as np
    from concurrent.futures import ThreadPoolExecutor

    load_dotenv()

    # Read DataFrame
    df = pd.read_csv(filename)

    # Load processed batches log if exists
    processed_batches = []
    if os.path.exists("processed_batches.log"):
        with open("processed_batches.log", "r") as log_file:
            processed_batches = [int(line.split()[-1]) for line in log_file.readlines()]

    # Batch processing
    for i in tqdm(range(0, df.shape[0], BATCH_SIZE)):
        if i in processed_batches:
            print(f"Skipping batch starting at index {i}")
            continue
        
        batch = df.iloc[i:i+BATCH_SIZE]
        species_names = batch[DF_FIELD_NAME].to_list()
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(generate_rarity_batch, [species_names]*repeats))

        with open("processed_batches.log", "a") as log_file:
            log_file.write(f"Processed batch starting at index {i}\n")
        processed_batches.append(i)
        
        # Update the DataFrame
        for idx, (rarity_scores, _) in enumerate(results):
            if rarity_scores:
                for species, score in rarity_scores.items():
                    df.loc[df[DF_FIELD_NAME] == species, f'rarity_batch_{idx}'] = score

        # Save the updated DataFrame
        df.to_csv(FILENAME, index=False)
    
    df['rarityGpt'] = df[[f'rarity_batch_{idx}' for idx in range(repeats)]].mean(axis=1)
    df.to_csv(FILENAME, index=False)

if __name__ == '__main__':
    generate_rarity_all(FILENAME)