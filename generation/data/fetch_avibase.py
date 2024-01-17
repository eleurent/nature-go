import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm

REGION = 'EUO'
FORMAT = 'clements'
SPECIES_LIST_URL = f'https://avibase.bsc-eoc.org/checklist.jsp?region={REGION}&list={FORMAT}'


def get_species_list():
    # Get the bird listing table from Avibase
    html = requests.get(SPECIES_LIST_URL)
    content = html.content
    soup = BeautifulSoup(content, 'html.parser')

    # Information is in table tag with class table. There are two, the one we want is the last one.
    table = soup.find_all('table', 'table')
    bird_table = table[-1]
    trs = bird_table.find_all('tr')

    # Iterate through the table, removing the rows with the family details
    data = []
    for tr in trs:
        if tr.find('p'): continue
        tds = tr.find_all('td')
        if len(tds) == 3:
            name = tds[0].get_text()
            species = tds[1].get_text()
            link = 'http://avibase.bsc-eoc.org/' + tds[1].find('a')['href']
            status = tds[2].get_text()
            row = {'name': name, 'species': species, 'link': link, 'status': status}
            data.append(row)
    df = pd.DataFrame(data)
    return df

def get_species_detail(species_row):
    try:
        html = requests.get(species_row.link)
        content = html.content
        soup = BeautifulSoup(content, 'html.parser')
        taxoninfo_div = soup.find("div", id="taxoninfo")

        scientificName = taxoninfo_div.find('b', string='Scientific:').find_next_sibling('i').string
        protonym = taxoninfo_div.find('b', string='Protonym:').find_next_sibling('i').string
        family = taxoninfo_div.find('b', string='Family:').find_next_sibling('a').string
        genus = taxoninfo_div.find('b', string='Genus:').find_next_sibling('a').string
        citation = taxoninfo_div.find('b', string='Citation:').find_next_sibling('a').string
        avibaseId = species_row.link.split('avibaseid=')[1]

        species_row['scientificName'] = scientificName
        species_row['protonym'] = protonym
        species_row['family'] = family
        species_row['genus'] = genus
        species_row['citation'] = citation
        species_row['avibaseId'] = avibaseId
    except Exception:
        pass
    return species_row


species_df = get_species_list()
species_df = pd.DataFrame([get_species_detail(row) for _, row in tqdm(list(species_df.iterrows()))])
species_df.to_csv('bird_species.csv')