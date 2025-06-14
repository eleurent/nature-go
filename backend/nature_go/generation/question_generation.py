import typing as tp
import json
from string import Template
from .prompts import question_prompt
from . import utils

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


def generate_questions(generate_text: tp.Callable, species, material: str | None = None, prompt: str=question_prompt.question_prompt_few_shot):
    common_name, scientific_name = species.commonNames[0], species.scientificNameWithoutAuthor
    if not material:
        material = utils.get_wikipedia_species_page(common_name, scientific_name)
    prompt = Template(prompt).substitute(species_name=common_name, material=material)

    response = generate_text(contents=[prompt])
    questions = parse_questions(response)
    return questions, response

