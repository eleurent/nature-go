import typing as tp
import json
from . import utils
from .prompts import description_prompt


def replace_today(summary):
    words = summary.split(" ", 1)
    if words[0] == "Today,":
        return "[DATE], " + words[1]
    else:
        return summary    

def get_leaf_nodes(data):
    """Recursively extracts leaf nodes from a JSON-like object."""
    if isinstance(data, dict):
        leaves = []
        for value in data.values():
            leaves.extend(get_leaf_nodes(value))
        return leaves
    elif isinstance(data, list):
        leaves = []
        for item in data:
            leaves.extend(get_leaf_nodes(item))
        return leaves
    else:
        return [data]
 
def generate_descriptions(generate_text: tp.Callable, species, prompt: str = description_prompt.summary_v8, material: str | None = None):
    # Fill in the prompt
    common_name, scientific_name = species.commonNames[0], species.scientificNameWithoutAuthor
    if not material:
        material = utils.get_wikipedia_species_page(common_name, scientific_name)
    job_name = {'bird': 'ornithologist', 'plant': 'botanist'}[species.type]
    prompt = prompt.format(species_name=common_name, material=material, job_name=job_name)

    # Generate and parse response
    try:
        response = generate_text(contents=[prompt])
    except ValueError as e:
        print(e)
        return {}
    descriptions = json.loads(response)
    descriptions = get_leaf_nodes(descriptions)
    descriptions = [replace_today(desc) for desc in descriptions]
    return descriptions, response
