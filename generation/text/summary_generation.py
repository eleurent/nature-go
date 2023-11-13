import wikipedia
import openai
import random 
from summary_prompt import *


from gpt_utils import try_except_decorator, get_config, filter_and_get_within_context, parse_summary

def replace_today(summary):
    words = summary.split(" ", 1)
    if words[0] == "Today,":
        return "[DATE], " + words[1]
    else:
        return summary

@try_except_decorator
def generate_summaries_variable_length(plant_name, prompt="summary_v", num_try=0):

    gpt_config = get_config("question_generation")

    # randomly select one prompt from summary_v1, summary_v2, summary_v3... for diversity
    num_prompt = random.randint(1, 5)
    prompt = eval(prompt + str(num_prompt))

    plant_page = wikipedia.page(plant_name).content
    max_length = 4097 - len(prompt) - len(plant_name)
    plant_page = filter_and_get_within_context(plant_page, max_length=max_length, num_try=num_try)

    prompt = prompt.format(plant_name=plant_name, material=plant_page)
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        messages=messages,
        **gpt_config,
    )
    response = response["choices"][0]["message"]["content"]
    summaries = parse_summary(response, three_paragraphs=False)
    updated_summaries = {key: replace_today(value) for key, value in summaries.items()}
    return updated_summaries

@try_except_decorator
def generate_summaries_three_paragraphs(plant_name, prompt="summary3_v", num_try=0):

    gpt_config = get_config("question_generation")

    # randomly select one prompt from summary_v1, summary_v2, summary_v3... for diversity
    num_prompt = random.randint(1, 1)
    prompt = eval(prompt + str(num_prompt))

    try:
        plant_page = wikipedia.page(plant_name).content
    except:
        plant_page = "No material found."
    max_length = 4097 - len(prompt) - len(plant_name)
    plant_page = filter_and_get_within_context(plant_page, max_length=max_length, num_try=num_try)

    prompt = prompt.format(plant_name=plant_name, material=plant_page)
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        messages=messages,
        **gpt_config,
    )
    response = response["choices"][0]["message"]["content"]
    response = "First paragraph:" + response
    print(response)
    summaries = parse_summary(response)
    updated_summaries = {key: replace_today(value) for key, value in summaries.items()}
    return updated_summaries