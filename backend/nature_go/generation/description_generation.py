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
 
def generate_descriptions(generate_text: tp.Callable, species, prompt: str = description_prompt.summary_v9, material: str | None = None):
    # Fill in the prompt
    common_name, scientific_name = species.commonNames[0], species.scientificNameWithoutAuthor
    if not material:
        material = utils.get_wikipedia_species_page(common_name, scientific_name)
    job_name = {'bird': 'ornithologist', 'plant': 'botanist'}[species.type]
    current_prompt_str = prompt.format(species_name=common_name, material=material, job_name=job_name)

    response_content = None
    # Generate and parse response
    try:
        if not callable(generate_text):
            # This check should ideally not be needed if type hints are respected,
            # but kept for robustness if a non-callable is somehow passed.
            raise TypeError(f"generate_text is not callable, it is {type(generate_text)}")
        response_content = generate_text(contents=[current_prompt_str])
    except ValueError as e:
        print(e) # Keep this print for actual ValueError from generate_text
        return {}, ""
    except TypeError as te: # Catch TypeErrors that might occur if generate_text is not as expected
        print(f"TypeError during generate_text call in generate_descriptions: {te}")
        raise

    if not isinstance(response_content, str):
        # Handle cases where generate_text might not return a string as expected
        print(f"Warning: response_content from generate_text is not a string. Type: {type(response_content)}")
        return [], ""

    descriptions_data = json.loads(response_content)
    descriptions = get_leaf_nodes(descriptions_data)
    descriptions = [replace_today(desc) for desc in descriptions]
    return descriptions, response_content
