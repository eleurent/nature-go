
import requests
from PIL import Image
import io
import base64
from IPython.display import display
import pandas as pd
from pathlib import Path
import wikipedia
import urllib.request
import tqdm
import nature_go_client
import matplotlib.pyplot as plt
import sys
import rembg
from illustration_workflows import txt2img_workflow
from illustration_workflows import controlnet_workflow
    

# Nature Go parameters
print('Nature go username?')
NG_USERNAME = input()
print('Nature go password?')
NG_PASSWORD = input()

# Stable Diffusion parameters
SD_HOST = 'http://nature-go.edouardleurent.com'
PROMPT = "herbarium illustration of {commonNames} {scientificNameWithoutAuthor}, 19th century, transactions of the Botanical Society of London"


# ## Retrieve species with missing images through Nature go API


def get_species():
    species_list = client.get_labeled_species(illustration=False, limit=5)
    print(f'Found {len(species_list)} species')
    species_list = pd.DataFrame(species_list)
    return species_list.iloc[0]


def download_image(url):
    with urllib.request.urlopen(url) as url:
        img = Image.open(io.BytesIO(url.read()))
        return img

def fetch_wikipedia_images(scientific_name):
    page = wikipedia.page(scientific_name)
    return page.images[:1]


def display_images(*images):
    _, axes = plt.subplots(1, len(images), figsize=(5*len(images), 5), squeeze=False)
    for i, image in enumerate(images):
        axes.flat[i].imshow(image)
        axes.flat[i].axis('off')

def run_txt2img_worflow(positive_prompt, negative_prompt):
    import random
    random.seed(len(positive_prompt))
    result = txt2img_workflow.main(positive_prompt=positive_prompt, negative_prompt=negative_prompt)
    illustration = Image.open(Path(comfyui_path) / 'output' / result['illustration']['ui']['images'][0]['filename'])
    illustration_transparent = rembg.remove(illustration, session=rembg_session)
    return illustration, illustration_transparent


def run_controlnet_worflow(positive_prompt, negative_prompt, reference_image_name):
    import random
    random.seed(len(positive_prompt))
    result = controlnet_workflow.main(positive_prompt=positive_prompt, negative_prompt=negative_prompt, control_image=reference_image_name)
    illustration = Image.open(Path(comfyui_path) / 'output' / result['illustration']['ui']['images'][0]['filename'])
    mask = Image.open(Path(comfyui_path) / 'output' / result['controlnet_mask']['ui']['images'][0]['filename'])
    illustration_transparent = rembg.remove(illustration, session=rembg_session)
    return illustration, illustration_transparent, mask

def send_results(illustration, illustration_transparent, reference_illustration, reference_illustration_transparent, reference_image_url):
    client.update_species_image(species_id=species.id, image=illustration, image_name='illustration')
    client.update_species_image(species_id=species.id, image=illustration_transparent, image_name='illustration_transparent')
    client.update_species_image(species_id=species.id, image=reference_illustration, image_name='reference_illustration')
    client.update_species_image(species_id=species.id, image=reference_illustration_transparent, image_name='reference_illustration_transparent')
    if len(reference_image_url) < 255:
        client.update_species_field(species_id=species.id, key='reference_image_url', value=reference_image_url) 


client = nature_go_client.NatureGoClient(username=NG_USERNAME, password=NG_PASSWORD)
client.login()
comfyui_path = txt2img_workflow.find_path("ComfyUI")
rembg_session = rembg.new_session(model_name="isnet-general-use")

while True:
    species = get_species()
    print('#############################')
    print('#############################')
    print(species.commonNames[:3], species.scientificNameWithoutAuthor)
    prompt = PROMPT.format(commonNames=', '.join(species.commonNames[:3]), scientificNameWithoutAuthor=species.scientificNameWithoutAuthor)    
    illustration, illustration_transparent = run_txt2img_worflow(positive_prompt=prompt, negative_prompt='')
    print('Generated txt2img illustration.')
    reference_image_url = fetch_wikipedia_images(species.scientificNameWithoutAuthor)[0]
    reference_image = download_image(reference_image_url)
    reference_image_name = f"reference_{species.scientificNameWithoutAuthor}.png"
    reference_image.save(Path(comfyui_path) / "input" / reference_image_name)
    reference_illustration, reference_illustration_transparent, mask = run_controlnet_worflow(positive_prompt=prompt, negative_prompt='black and white', reference_image_name=reference_image_name)
    print('Generated controlnet illustration.')
    send_results(illustration, illustration_transparent, reference_illustration, reference_illustration_transparent, reference_image_url)
    print('Uploaded results.')


