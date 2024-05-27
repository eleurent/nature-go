import requests
from bs4 import BeautifulSoup
import wikipedia
from markdown import markdown
import re

def is_wikipedia_species_page(page):
    response = requests.get(page.url)
    soup = BeautifulSoup(response.text, 'html.parser')
    side_panel = soup.find('table', {'class': "infobox"})
    return side_panel and side_panel.find('a', string='Scientific classification')


def get_wikipedia_species_page(common_name: str, scientific_name: str):
    page = wikipedia.page(scientific_name, auto_suggest=False)
    if is_wikipedia_species_page(page): return page
    if not common_name: raise wikipedia.PageError(scientific_name)
    page = wikipedia.page(common_name)
    if is_wikipedia_species_page(page): return page
    raise wikipedia.PageError(common_name)


def parse_summary(input_text, three_paragraphs=True):
    parsed_summaries = {}

    # Define the labels to look for in the input text
    if three_paragraphs:
        labels = ['First paragraph:', 'Second paragraph:', 'Third paragraph:']
    else:
        labels = ['Long summary:', 'Medium summary:', 'Short summary:']

    start_index = 0
    for i, label in enumerate(labels):
        start_index = input_text.find(label, start_index)
        end_index = input_text.find(labels[i + 1], start_index) if i + 1 < len(labels) else len(input_text)
        summary_text = input_text[start_index + len(label):end_index].strip()
        parsed_summaries[label[:-1].lower().replace(' ', '_')] = summary_text

    return parsed_summaries


def markdown_to_text(markdown_string):
    """ Converts a markdown string to plaintext """

    # md -> html -> text since BeautifulSoup can extract text cleanly
    html = markdown(markdown_string)

    # remove code snippets
    html = re.sub(r'<pre>(.*?)</pre>', ' ', html)
    html = re.sub(r'<code>(.*?)</code >', ' ', html)

    # extract text
    soup = BeautifulSoup(html, "html.parser")
    text = ''.join(soup.findAll(text=True))

    return text
