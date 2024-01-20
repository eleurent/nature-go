
import argparse
from PIL import Image
import io
import pandas as pd
from pathlib import Path
import wikipedia
import urllib.request
import tqdm
import sys
import rembg
from illustration_workflows import txt2img_workflow
from illustration_workflows import controlnet_workflow

sys.path.append('..')
import nature_go_client

# Stable Diffusion parameters
comfyui_path = txt2img_workflow.find_path("ComfyUI")
SD_HOST = 'http://nature-go.edouardleurent.com'
PROMPT = {
    'plant': '{commonNames} {scientificNameWithoutAuthor}, 19th century botanical illustration',
    'bird': '{commonNames}, 19th century ornithology illustration',
}
BATCH_SIZE = 100

def get_species(client, type, batch_size=5, ordering=None):
    """Retrieve species with missing images through Nature go API."""
    ordering = ordering.split(',') if ',' in ordering else ordering
    species_list = client.get_labeled_species(type, illustration=False, limit=batch_size, ordering=ordering)
    print(f'Found {len(species_list)} species')
    return pd.DataFrame(species_list)

def download_image(url):
    with urllib.request.urlopen(url) as url:
        img = Image.open(io.BytesIO(url.read()))
        return img

def fetch_wikipedia_images(scientific_name):
    page = wikipedia.page(scientific_name)
    return page.images[:1]

def run_txt2img_worflow(positive_prompts, negative_prompts, rembg_session):
    import random
    random.seed(len(positive_prompts[0]))
    for result in txt2img_workflow.main(positive_prompts=positive_prompts, negative_prompts=negative_prompts):
        illustration = Image.open(Path(comfyui_path) / 'output' / result['illustration']['ui']['images'][0]['filename'])
        illustration_transparent = rembg.remove(illustration, session=rembg_session)
        yield illustration, illustration_transparent

def run_controlnet_worflow(positive_prompt, negative_prompt, reference_image_name, rembg_session):
    import random
    random.seed(len(positive_prompt))
    result = controlnet_workflow.main(positive_prompt=positive_prompt, negative_prompt=negative_prompt, control_image=reference_image_name)
    illustration = Image.open(Path(comfyui_path) / 'output' / result['illustration']['ui']['images'][0]['filename'])
    mask = Image.open(Path(comfyui_path) / 'output' / result['controlnet_mask']['ui']['images'][0]['filename'])
    illustration_transparent = rembg.remove(illustration, session=rembg_session)
    return illustration, illustration_transparent, mask

def single_controlnet_workflow(species, positive_prompt):
    reference_image_url = fetch_wikipedia_images(species.scientificNameWithoutAuthor)[0]
    reference_image = download_image(reference_image_url)
    reference_image_name = f"reference_{species.scientificNameWithoutAuthor}.png"
    reference_image.save(Path(comfyui_path) / "input" / reference_image_name)
    reference_illustration, reference_illustration_transparent, mask = run_controlnet_worflow(positive_prompt=positive_prompt, negative_prompt='black and white', reference_image_name=reference_image_name)
    print('Generated controlnet illustration.')
    return reference_illustration, reference_illustration_transparent, mask

def send_results(client, species, illustration, illustration_transparent, reference_illustration, reference_illustration_transparent, reference_image_url):
    if illustration:
        client.update_species_image(species_id=species.id, image=illustration, image_name='illustration')
    if illustration_transparent:
        client.update_species_image(species_id=species.id, image=illustration_transparent, image_name='illustration_transparent')
    if reference_illustration:
        client.update_species_image(species_id=species.id, image=reference_illustration, image_name='reference_illustration')
    if reference_illustration_transparent:
        client.update_species_image(species_id=species.id, image=reference_illustration_transparent, image_name='reference_illustration_transparent')
    if reference_image_url and len(reference_image_url) < 255:
        client.update_species_field(species_id=species.id, key='reference_image_url', value=reference_image_url) 

def main(args):
    print('Nature go username?')
    username = input()
    print('Nature go password?')
    password = input()
    client = nature_go_client.NatureGoClient(username=username, password=password)
    client.login()
    rembg_session = rembg.new_session(model_name="isnet-general-use")

    while True:
        species_batch = get_species(client, args.type, batch_size=args.batch_size, ordering=args.ordering)
        print('#############################')
        positive_prompts = []
        for _, species in species_batch.iterrows():
            prompt = args.prompt if args.prompt else PROMPT[species.type]
            positive_prompts.append(prompt.format(
                commonNames=', '.join(species.commonNames[:3]),
                scientificNameWithoutAuthor=species.scientificNameWithoutAuthor
            ))
        negative_prompts = [''] * len(positive_prompts)
        if not positive_prompts: return
        for (illustration, illustration_transparent), (_, species) in zip(
            run_txt2img_worflow(positive_prompts=positive_prompts, negative_prompts=negative_prompts, rembg_session=rembg_session),
            species_batch.iterrows()
        ):
            print(f'Generated txt2img illustration of {species.scientificNameWithoutAuthor}.')
            send_results(client, species, illustration, illustration_transparent, None, None, None)
            print('Uploaded results.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", help="species type, bird/plant", type=str)
    parser.add_argument("--ordering", help="species ordering", type=str, default='-observation_count,rarity_gpt,-occurences_cdf')
    parser.add_argument("--batch_size", help="batch size", type=int, default=100)
    parser.add_argument("--prompt", help="prompt", type=str, default='')
    args = parser.parse_args()
    main(args)