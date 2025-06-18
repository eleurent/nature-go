import replicate
from PIL import Image

BACKGROUND_REMOVAL_ENDPOINT = "abhisingh0909/rembg:9b5eeb79d1be3900b39303bbbc0b96dab38515cb06c92eac75425596cf753393"


def remove_background(image: Image) -> Image:
    input = {
        "image":  image
    }
    output = replicate.run(
        BACKGROUND_REMOVAL_ENDPOINT,
        input=input
    )
    return Image.open(output)