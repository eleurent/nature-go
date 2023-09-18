import pandas as pd
import wikipedia
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor

from functools import wraps
from time import sleep
from random import uniform
import wikipedia.exceptions
import http.client

wikipedia.set_lang('en')

def retry_request(max_retries=3, delay_range=(0.5, 1.5)):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except (wikipedia.exceptions.PageError, wikipedia.exceptions.DisambiguationError):
                    return -1
                except (wikipedia.exceptions.HTTPTimeoutError, http.client.RemoteDisconnected):
                    retries += 1
                    sleep(uniform(*delay_range))
            return -1  # return -1 after max_retries
        return wrapper
    return decorator

@retry_request(max_retries=3, delay_range=(0.5, 1.5))
def get_wiki_word_count(plant_name):
    try:
        content = wikipedia.page(plant_name, auto_suggest=False).content
        return len(content.split())
    except wikipedia.exceptions.PageError:
        return -1
    except wikipedia.exceptions.DisambiguationError:
        try:
            content = wikipedia.page(f"{plant_name} (plant)", auto_suggest=False).content
            return len(content.split())
        except (wikipedia.exceptions.PageError, wikipedia.exceptions.DisambiguationError):
            return -1


# Add a new column to the DataFrame with Wikipedia word counts
df = pd.read_csv('data/species.csv')

chunk_size = 100  # Number of rows to process before saving
n_chunks = len(df) // chunk_size + (1 if len(df) % chunk_size else 0)

def parallel_get_wiki_word_count(start_idx, end_idx):
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(get_wiki_word_count, df.loc[start_idx:end_idx-1, 'scientificNameWithoutAuthor']))
    return results

for i in tqdm(range(n_chunks)):
    start_idx = i * chunk_size
    end_idx = (i + 1) * chunk_size
    
    # Process each chunk in parallel and update the original DataFrame
    df.loc[start_idx:end_idx-1, 'WikipediaWordCount'] = parallel_get_wiki_word_count(start_idx, end_idx)
    
    # Save the DataFrame to the same file
    df.to_csv('data/species_with_word_count.csv', index=False)
