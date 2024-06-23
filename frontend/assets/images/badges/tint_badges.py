from pathlib import Path
from PIL import Image, ImageEnhance

def tint_image(image_path, tint_color, tint_ratio=0.5):
    img = Image.open(image_path)
    tint = Image.new("RGB", img.size, tint_color)

    # Separate alpha channel
    alpha = img.split()[-1]  

    # Convert to grayscale
    img = img.convert('LA')

    # Blend only RGB channels, leaving alpha intact
    rgb_channels = Image.blend(img.convert("RGB"), tint, tint_ratio)
    
    # Recombine RGB channels with original alpha
    img = Image.merge("RGBA", (*rgb_channels.split(), alpha))

    # Enhancements
    img = ImageEnhance.Brightness(img).enhance(1.1)
    img = ImageEnhance.Contrast(img).enhance(1.1)

    return img

def tint_images_in_directory(directory, tint_color, output_directory):
    directory_path = Path(directory)
    output_path = Path(output_directory)
    output_path.mkdir(parents=True, exist_ok=True)

    for image_path in directory_path.iterdir():
        if image_path.suffix == ".png":  # Filter for PNG files
            print(image_path.name)
            tinted_img = tint_image(image_path, tint_color)
            tinted_img.save(output_path / image_path.name)

# Example usage
tint_images_in_directory(directory=".", tint_color="gray", output_directory="none/")
tint_images_in_directory(directory=".", tint_color="chocolate", output_directory="bronze/")
tint_images_in_directory(directory=".", tint_color="silver", output_directory="silver/")
tint_images_in_directory(directory=".", tint_color="gold", output_directory="gold/")