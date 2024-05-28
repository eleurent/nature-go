import random
import typing as tp
from generation import utils


def parse_descriptions(input_text):
    assert '<BREAK' in input_text
    input_text = input_text.replace('<BREAK_1>', '<BREAK>')
    input_text = input_text.replace('<BREAK_2>', '<BREAK>')
    input_text = input_text.replace('<BREAK_3>', '<BREAK>')
    parts = input_text.split('<BREAK>')
    descripions = [part.strip() for part in parts[:3]]
    return descripions

def replace_today(summary):
    words = summary.split(" ", 1)
    if words[0] == "Today,":
        return "[DATE], " + words[1]
    else:
        return summary
 
def generate_descriptions(generate_text: tp.Callable, species, prompt: str, material: str | None = None):
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
    descriptions = parse_descriptions(response)
    descriptions = [replace_today(desc) for desc in descriptions]
    return descriptions
