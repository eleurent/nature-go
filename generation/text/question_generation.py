import typing as tp
import re
import prompts.question_prompt
import utils
import json
from string import Template

def parse_questions(questions: str):
    start_index = questions.find("[")
    end_index = questions.rfind("]")
    json_string = questions[start_index:end_index + 1]
    try:
        data = json.loads(json_string)
    except json.decoder.JSONDecodeError as e:
        print(questions)
        return []
    return data


def generate_questions(generate_text: tp.Callable, species, material: str | None = None, prompt: str=prompts.question_prompt.question_prompt_few_shot):
    common_name, scientific_name = species.display_name, species.scientificNameWithoutAuthor
    if not material:
        material = utils.get_wikipedia_species_page(common_name, scientific_name).content
    prompt = Template(prompt).substitute(species_name=common_name, material=material)

    response = generate_text(contents=[prompt])
    questions = parse_questions(response)
    return questions, response

