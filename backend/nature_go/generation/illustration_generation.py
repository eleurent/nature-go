from io import BytesIO
import typing as tp
from django.core.files.base import ContentFile, File
from generation.prompts import illustration_prompt
from PIL import Image
import math
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
    illustration_transparent = remove_background_by_pixel(illustration)
    bytes_io = BytesIO()
    illustration_transparent.save(bytes_io, 'PNG')  
    file_name = f"{scientific_name.replace(' ', '_')}_illustration_transparent.png"
    species.illustration_transparent.save(file_name, File(bytes_io), save=False)
    species.save()
    return True


def remove_background_by_pixel(img, ref_coords=(5, 5), tolerance=30):
    """
    Removes the background of an image based on a reference pixel's color.
    """
    # Convert the image to RGBA (if it isn't already) to support transparency
    img = img.convert("RGBA")
    # Get the image data as a sequence of pixels
    pixel_data = img.getdata()
    # Get the color of the reference pixel at the specified coordinates
    try:
        ref_pixel_color = img.getpixel(ref_coords)
    except IndexError:
        print(f"Error: Reference coordinates {ref_coords} are out of bounds for the image.")
        print(f"Image size is {img.size}.")
        return
    new_data = []
    ref_r, ref_g, ref_b, _ = ref_pixel_color
    for item in pixel_data:
        # Unpack the current pixel's color
        r, g, b, a = item
        
        # Calculate the color distance (Euclidean distance in RGB space)
        # This determines how "close" the current pixel's color is to the reference color.
        distance = math.sqrt(
            math.pow(r - ref_r, 2) +
            math.pow(g - ref_g, 2) +
            math.pow(b - ref_b, 2)
        )

        # If the distance is within the tolerance, make the pixel transparent
        if distance < tolerance:
            # Append a transparent pixel (R, G, B, Alpha)
            new_data.append((r, g, b, 0))
        else:
            # Otherwise, keep the original pixel
            new_data.append(item)

    # Update the image with the new pixel data
    img.putdata(new_data)
    return img

