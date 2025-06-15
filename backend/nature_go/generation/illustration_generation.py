from io import BytesIO
import typing as tp
from django.core.files.base import ContentFile, File
from generation.prompts import illustration_prompt
from rembg import remove
from PIL import Image
from observation.models import Species


def generate_illustration(generate_image: tp.Callable, species: Species) -> bool:
    if species.illustration:
        return True
    common_name = species.commonNames[0] if species.commonNames else species.scientificNameWithoutAuthor
    scientific_name = species.scientificNameWithoutAuthor
    field_name = {Species.PLANT_TYPE: 'Botany', Species.BIRD_TYPE: 'Ornithology'}[species.type]
    prompt_text = illustration_prompt.prompt_v2.format(
        common_name=common_name,
        scientific_name=scientific_name,
        field_name=field_name,
    )
    raw_bytes = generate_image(prompt_text)

    if raw_bytes:
        file_name = f"{scientific_name.replace(' ', '_')}_illustration.png"
        species.illustration.save(file_name, ContentFile(raw_bytes), save=False)
        species.save()
        return True
    return False

def generate_illustration_transparent(species) -> bool:
    if not species.illustration:
        return False
    if species.illustration_transparent:
        return True
    scientific_name = species.scientificNameWithoutAuthor
    illustration = Image.open(species.illustration)
    illustration_transparent = remove(illustration)
    bytes_io = BytesIO()
    illustration_transparent.save(bytes_io, 'JPEG')  
    file_name = f"{scientific_name.replace(' ', '_')}_illustration.png"
    species.illustration_transparent.save(file_name, File(bytes_io), save=False)
    species.save()
    return True

