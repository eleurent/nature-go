import openai
import re
import os
from dotenv import load_dotenv

from rarity_prompts import *
from gpt_utils import try_except_decorator, get_config, filter_and_get_within_context

FILENAME = "../data/bird_species.csv"
DF_FIELD_NAME = "name"
PROMPT_BATCH = "rarity_batch_bird_v2"
BATCH_SIZE = 100

@try_except_decorator
def generate_rarety(plant_name, prompt="rarity_v1", num_try=0):
    def extract_rarity_score(answer):
        pattern = r"([1-9])[^1-9]*$"
        match = re.search(pattern, answer)
        if match:
            return int(match.group(1))
        else:
            return None
    
    prompt = eval(prompt)
    prompt = prompt.format(plant_name=plant_name)

    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        messages=messages,
        **gpt_config,
    )
    response = response["choices"][0]["message"]["content"]

    print(response)

    return extract_rarity_score(response)


def get_species_names(df):
    return f'[{", ".join(df[DF_FIELD_NAME].tolist())}]'

@try_except_decorator
def generate_rarety_batch(species_names, prompt=PROMPT_BATCH, num_try=0, batch_size=100):
    def parse_rarity_batch(output_str):
        lines = output_str.strip().split("\n")
        rarity_dict = {}
        for line in lines:
            plant, rarity = line.split(":")
            rarity_dict[plant.strip()] = int(rarity.strip())
        return rarity_dict
    
    gpt_config = get_config("rarity_generation_batch")

    prompt = eval(prompt)
    prompt = prompt.format(species_names=species_names)
    messages = [{"role": "user", "content": prompt}]

    response = openai.ChatCompletion.create(messages=messages, **gpt_config)
    response = response["choices"][0]["message"]["content"]
    return parse_rarity_batch(response)

if __name__ == '__main__':
    from tqdm import tqdm
    import pandas as pd
    import numpy as np
    from concurrent.futures import ThreadPoolExecutor

    N = 5

    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")

    # Read DataFrame
    df = pd.read_csv(FILENAME)

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
        species_names = get_species_names(batch)
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(generate_rarety_batch, [species_names]*N))

        with open("processed_batches.log", "a") as log_file:
            log_file.write(f"Processed batch starting at index {i}\n")
        processed_batches.append(i)
        
        # Update the DataFrame
        for idx, rarity_scores in enumerate(results):
            if rarity_scores:
                for species, score in rarity_scores.items():
                    df.loc[df[DF_FIELD_NAME] == species, f'rarity_batch_{idx}'] = score

        # Save the updated DataFrame
        df.to_csv(FILENAME, index=False)
    
    df['rarityGpt'] = df[[f'rarity_batch_{idx}' for idx in range(N)]].mean(axis=1)
    df.to_csv(FILENAME, index=False)