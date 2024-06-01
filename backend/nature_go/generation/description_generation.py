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
 
def generate_descriptions(generate_text: tp.Callable, species, prompt: str = description_prompt.summary_v7, material: str | None = None):
    # Fill in the prompt
    common_name, scientific_name = species.commonNames[0], species.scientificNameWithoutAuthor
    if not material:
        material = utils.get_wikipedia_species_page(common_name, scientific_name).content
    job_name = {'bird': 'ornithologist', 'plant': 'botanist'}[species.type]
    prompt = prompt.format(species_name=common_name, material=material, job_name=job_name)

    # Generate and parse response
    try:
        response = generate_text(contents=[prompt])
    except ValueError as e:
        print(e)
        return {}
    descriptions = json.loads(response)
    descriptions = [replace_today(desc) for desc in descriptions]
    return descriptions, response
