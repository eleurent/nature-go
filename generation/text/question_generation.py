import wikipedia
import openai
import re
from question_prompt import *

from gpt_utils import try_except_decorator, get_config, filter_and_get_within_context

def parse_questions(questions: str):
    question_set_regex = r"Question (\d+):\n(.+?)\n((?:[A-D]: .+?\n)+)Answer: (\w)"
    question_sets= re.findall(question_set_regex, questions, re.DOTALL)
    output = []
    # Loop through each question set to extract details
    for idx, (q_num, question_text, q_choices, q_answer) in enumerate(question_sets):
        choices = re.findall(r"\w: (.+)", q_choices)

        # Convert letter-based answer to zero-based index
        correct_choice = ord(q_answer) - ord('A')

        # Build dictionary
        question_dict = {
            'question': question_text.strip(),
            'choices': choices,
            'correct_choice': correct_choice
        }

        # Append to output
        output.append(question_dict)
    return output


@try_except_decorator
def generate_questions(plant_name: str, prompt: str="question_prompt_few_shot", num_try: int=0):

    gpt_config = get_config("question_generation")

    prompt = eval(prompt)
    plant_page = wikipedia.page(plant_name).content
    max_length = 4097 - len(prompt) - len(plant_name)
    plant_page = filter_and_get_within_context(plant_page, max_length=max_length, num_try=num_try)

    prompt = prompt.format(plant_name=plant_name, material=plant_page)

    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        messages=messages,
        **gpt_config,
    )
    questions = response["choices"][0]["message"]["content"]
    questions = parse_questions(questions)
    return questions
