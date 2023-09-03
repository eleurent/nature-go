import nature_go_client
import urllib
import logging
import io
from PIL import Image

logging.basicConfig(level=logging.INFO)

client = nature_go_client.NatureGoClient(username='<username>', password='<password>')
client.login()
species_list = client.get_all_species()
species_list = [s for s in species_list if not s['illustration_transparent']]
if species_list:
    with urllib.request.urlopen('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Saxifraga_aizoides_Sturm55.jpg/800px-Saxifraga_aizoides_Sturm55.jpg') as url:
        image = Image.open(io.BytesIO(url.read()))
    client.update_species_illustration(species_id=species_list[0]['id'], image=image, illustration_name='illustration_transparent')