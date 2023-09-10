import yaml
import openai
import time
from typing import Any, Callable
import tiktoken
import re

def filter_and_get_within_context(text: str, max_length: int, num_try: int=0) -> str:
    # Sections to remove
    if num_try == 0:
        to_remove = ['Gallery', 'References', 'External links', 'See also', 'Taxonomy', 'Cultivars']
    else:
        to_remove = ['Gallery', 'References', 'External links', 'See also', 'Taxonomy', 'Cultivars', 'Propagation']

    def get_substring_withing_context(text: str, max_tokens: int=4097, encoding_name: str = "cl100k_base") -> str:
        encoding = tiktoken.get_encoding(encoding_name)
        tokens = encoding.encode(text)[:max_tokens]
        limited_text = encoding.decode(tokens)

        last_sentence_end = max(limited_text.rfind(x) for x in [".", "!", "?"])

        if last_sentence_end != -1:
            final_substring = limited_text[:last_sentence_end + 1]
        else:
            final_substring = limited_text  # If no end-of-sentence found, return as is

        return final_substring

    for section in to_remove:
        # Create a regex pattern to match the section name and its content until the next section or end of the text.
        pattern = f"== {section} ==.*?(?=(== [a-zA-Z0-9 ]+ ==|$))"
        text = re.sub(pattern, "", text, flags=re.S)

    if num_try < 2:
        return text

    return get_substring_withing_context(text, max_tokens=max_length)


def get_config(mode: str) -> dict[str, Any]:
    """
    Get config from config_gpt.yaml
    valid modes: ['question_generation', 'summary_generation']
    """

    with open(f"config_gpt/{mode}.yaml", "r") as f:
        config = yaml.load(f, Loader=yaml.FullLoader)
    return config


def try_except_decorator(func: Callable) -> Callable:
    def func_wrapper(*args: Any, **kwargs: Any) -> Callable:
        trials_counter = 0
        while True:
            try:
                return func(*args, **kwargs, num_try=trials_counter)
            except (
                    openai.error.RateLimitError,
                    openai.error.ServiceUnavailableError,
                    openai.error.APIError,
                    openai.error.Timeout,
                    openai.error.APIConnectionError,
                    openai.error.InvalidRequestError,
            ) as e:
                print("API error occurred:", str(e), ". Retrying in 1 second...")

                # If the error is not an invalid request error, then wait for 1 second;
                # otherwise, increment the history counter to discard the oldest message.
                if type(e) != openai.error.InvalidRequestError:
                    time.sleep(1)
                else:
                    trials_counter += 1
    return func_wrapper

def parse_summary(input_text):
    parsed_summaries = {}

    # Define the labels to look for in the input text
    labels = ['Long summary:', 'Medium summary:', 'Short summary:']

    start_index = 0
    for i, label in enumerate(labels):
        start_index = input_text.find(label, start_index)
        end_index = input_text.find(labels[i + 1], start_index) if i + 1 < len(labels) else len(input_text)
        summary_text = input_text[start_index + len(label):end_index].strip()
        parsed_summaries[label[:-1].lower().replace(' ', '_')] = summary_text

    return parsed_summaries