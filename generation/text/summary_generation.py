import random
import typing as tp
from prompts.summary_prompt import *
import utils


def parse_summary(input_text):
    parsed_summaries = {'original': input_text}
    assert '<BREAK' in input_text
    input_text = input_text.replace('<BREAK_1>', '<BREAK>')
    input_text = input_text.replace('<BREAK_2>', '<BREAK>')
    input_text = input_text.replace('<BREAK_3>', '<BREAK>')
    parts = input_text.split('<BREAK>')
    parsed_summaries.update({f'part_{i+1}': part.strip() for i, part in enumerate(parts)})
    return parsed_summaries

def replace_today(summary):
    words = summary.split(" ", 1)
    if words[0] == "Today,":
        return "[DATE], " + words[1]
    else:
        return summary
 
def generate_summaries(generate_text: tp.Callable, species, material: str | None = None, prompt: str | None = None,):
    if prompt is None:
        # randomly select one prompt from summary_v1, summary_v2, summary_v3... for diversity
        prompt = eval(f'summary_v{random.randint(1, 1)}')

    # Fill in the prompt
    common_name, scientific_name = species.display_name, species.scientificNameWithoutAuthor
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
    summaries = parse_summary(response)
    updated_summaries = {key: replace_today(value) for key, value in summaries.items()}
    return updated_summaries
