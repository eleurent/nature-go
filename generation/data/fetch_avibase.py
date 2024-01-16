import requests
from bs4 import BeautifulSoup
import pandas as pd

REGION = 'UKen'
FORMAT = 'clements'

# Get the bird listing table for England from Avibase
html = requests.get(f'https://avibase.bsc-eoc.org/checklist.jsp?region={REGION}&list={FORMAT}')
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
        row = {'Name': name, 'Species': species, 'Link': link, 'Status': status}
        data.append(row)

df = pd.DataFrame(data)
df.to_csv('bird_species.csv')