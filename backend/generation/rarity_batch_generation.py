import openai
import re
import os
from dotenv import load_dotenv

from rarity_prompts import *
from gpt_utils import try_except_decorator, get_config, filter_and_get_within_context

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


def get_plant_names(df):
    return f'[{", ".join(df["scientificNameWithoutAuthor"].tolist())}]'

@try_except_decorator
def generate_rarety_batch(plant_names, prompt="rarity_batch_v1", num_try=0, batch_size=100):
    def parse_rarity_batch(output_str):
        lines = output_str.strip().split("\n")
        rarity_dict = {}
        for line in lines:
            plant, rarity = line.split(":")
            rarity_dict[plant.strip()] = int(rarity.strip())
        return rarity_dict
    
    gpt_config = get_config("rarity_generation_batch")

    prompt = eval(prompt)
    prompt = prompt.format(plant_names=plant_names)
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
    df_sample = pd.read_csv("data/species_with_rarity.csv")

    # Load processed batches log if exists
    processed_batches = []
    if os.path.exists("processed_batches.log"):
        with open("processed_batches.log", "r") as log_file:
            processed_batches = [int(line.split()[-1]) for line in log_file.readlines()]

    # Batch processing
    for i in tqdm(range(0, 6200, 100)):
        if i in processed_batches:
            print(f"Skipping batch starting at index {i}")
            continue
        
        batch = df_sample.iloc[i:i+100]
        plant_names = get_plant_names(batch)
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(generate_rarety_batch, [plant_names]*N))

        with open("processed_batches.log", "a") as log_file:
            log_file.write(f"Processed batch starting at index {i}\n")
        processed_batches.append(i)
        
        # Update the DataFrame
        for idx, rarity_scores in enumerate(results):
            if rarity_scores:
                for plant, score in rarity_scores.items():
                    df_sample.loc[df_sample['scientificNameWithoutAuthor'] == plant, f'rarity_batch_{idx}'] = score

        # Save the updated DataFrame
        df_sample.to_csv("data/species_with_rarity2.csv", index=False)