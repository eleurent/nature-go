import wikipedia
import openai
import random 
from summary_prompt import *

from gpt_utils import try_except_decorator, get_config, filter_and_get_within_context, get_wikipedia_species_page


def parse_summary(input_text):
    parsed_summaries = {'original': input_text}

    # Define the labels to look for in the input text
    if 'Medium summary' in input_text:
        labels = ['Long summary:', 'Medium summary:', 'Short summary:']
        start_index = 0
        for i, label in enumerate(labels):
            start_index = input_text.find(label, start_index)
            end_index = input_text.find(labels[i + 1], start_index) if i + 1 < len(labels) else len(input_text)
            summary_text = input_text[start_index + len(label):end_index].strip()
            parsed_summaries[label.lower().replace(':', '').replace(' ', '_')] = summary_text
    elif '<BREAK' in input_text:
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

@try_except_decorator
def generate_summaries(common_name: str, scientific_name: str, material: str | None = None, prompt: str = "summary_v", num_try: int = 0):
    gpt_config = get_config("question_generation")

    if prompt == "summary_v":
        # randomly select one prompt from summary_v1, summary_v2, summary_v3... for diversity
        prompt += str(random.randint(1, 5))
    if "{plant_name}" not in prompt:
        prompt = eval(prompt)

    if not material:
        material = get_wikipedia_species_page(common_name, scientific_name).content
        max_length = 4097 - len(prompt) - len(common_name)
        material = filter_and_get_within_context(material, max_length=max_length, num_try=num_try)

    prompt = prompt.format(plant_name=common_name, material=material)
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        messages=messages,
        **gpt_config,
    )
    response = response["choices"][0]["message"]["content"]
    summaries = parse_summary(response)
    updated_summaries = {key: replace_today(value) for key, value in summaries.items()}
    return updated_summaries