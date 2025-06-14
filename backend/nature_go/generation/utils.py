import requests
from bs4 import BeautifulSoup
import wikipedia

def is_wikipedia_species_page(page):
    response = requests.get(page.url)
    soup = BeautifulSoup(response.text, 'html.parser')
    side_panel = soup.find('table', {'class': "infobox"})
    return side_panel and side_panel.find('a', string='Scientific classification')


def get_wikipedia_species_page(common_name: str, scientific_name: str):
    try:
        page = wikipedia.page(scientific_name, auto_suggest=False)
        if is_wikipedia_species_page(page): return page.content
        if not common_name: raise wikipedia.PageError(scientific_name)
        page = wikipedia.page(common_name)
        if is_wikipedia_species_page(page): return page.content
        raise wikipedia.PageError(common_name)
    except wikipedia.exceptions.PageError:
        return ''

