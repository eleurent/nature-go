import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm

REGIONS = ['NAM', 'EUO']
FORMAT = 'clements'
SPECIES_LIST_URL = 'https://avibase.bsc-eoc.org/checklist.jsp?region={REGION}&list={FORMAT}'


def get_region_species_list(region):
    # Get the bird listing table from Avibase
    html = requests.get(SPECIES_LIST_URL.format(REGION=region, FORMAT=FORMAT))
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

def get_species_list():
    df = pd.concat([get_region_species_list(region) for region in REGIONS], ignore_index=True)
    df = df.drop_duplicates(subset=['species'], keep='first')
    return df


def udate_species_detail(df, idx):
    if 'genus' in df.columns and not pd.isna(df.loc[idx, 'genus']): return
    html = requests.get(df.iloc[idx]['link'])
    content = html.content
    soup = BeautifulSoup(content, 'html.parser')
    if not soup: return
    taxoninfo_div = soup.find("div", id="taxoninfo")

    scientificName = taxoninfo_div.find('b', string='Scientific:').find_next_sibling('i').string
    protonym = taxoninfo_div.find('b', string='Protonym:').find_next_sibling('i').string
    family = taxoninfo_div.find('b', string='Family:').find_next_sibling('a').string
    genus = taxoninfo_div.find('b', string='Genus:').find_next_sibling('a').string
    citation = taxoninfo_div.find('b', string='Citation:').find_next_sibling('a').string
    avibaseId = df.iloc[idx]['link'].split('avibaseid=')[1]

    df.loc[idx, 'scientificName'] = scientificName
    df.loc[idx, 'protonym'] = protonym
    df.loc[idx, 'family'] = family
    df.loc[idx, 'genus'] = genus
    df.loc[idx, 'citation'] = citation
    df.loc[idx, 'avibaseId'] = avibaseId


def main():
    try:
        df = pd.read_csv('bird_species.csv')
    except FileNotFoundError:
        df = get_species_list()
        df.to_csv('bird_species.csv', index=False)

    for i in tqdm(range(df.shape[0])):
        udate_species_detail(df, i)

        if i % 25 == 0:
            df.to_csv('bird_species.csv', index=False)

    df.to_csv('bird_species.csv', index=False)


if __name__ == '__main__':
    main()