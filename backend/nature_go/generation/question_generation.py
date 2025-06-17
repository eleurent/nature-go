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

    if not isinstance(prompt, str):
        # This check is important as Template() expects a string.
        raise TypeError(f"Prompt must be a string, got {type(prompt)}")

    current_prompt_str = Template(prompt).substitute(species_name=common_name, material=material)

    response_content = None
    try:
        if not callable(generate_text):
            # This check should ideally not be needed if type hints are respected.
            raise TypeError(f"generate_text is not callable, it is {type(generate_text)}")
        response_content = generate_text(contents=[current_prompt_str])
    except TypeError as te:
        print(f"TypeError during generate_text call in generate_questions: {te}")
        raise

    if not isinstance(response_content, str):
        print(f"Warning: response_content from generate_text is not a string. Type: {type(response_content)}")
        return [], ""

    questions = parse_questions(response_content)
    return questions, response_content

