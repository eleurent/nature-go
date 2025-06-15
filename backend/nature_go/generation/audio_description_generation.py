import logging
from django.core.files.base import ContentFile
from generation import gemini

logger = logging.getLogger(__name__)

def generate_audio_description(species) -> bool:
    """
    Generates an audio description for the given species and saves it.

    Args:
        species: The species object (presumably a Django model instance)
                 with attributes like `descriptions`, `scientificNameWithoutAuthor`,
                 `commonNames`, and an `audio_description` FileField.

    Returns:
        True if audio generation and saving were successful, False otherwise.
    """
    try:
        if not species.descriptions:
            logger.error(f"No descriptions available for species {species.scientificNameWithoutAuthor} to generate audio.")
            return False

        prompt_text = f"{str(species)} ({species.scientificNameWithoutAuthor}). {species.descriptions[0]}"
        logger.info(f"Generating audio for: {prompt_text}")

        audio_bytes = gemini.generate_audio(prompt_text)

        if audio_bytes:
            file_name = f"{species.scientificNameWithoutAuthor.replace(' ', '_').lower()}_audio_desc.wav"
            species.audio_description.save(file_name, ContentFile(audio_bytes), save=False)
            # Note: The actual species.save() should be called separately after this function returns True.
            logger.info(f"Successfully generated audio description for {species.scientificNameWithoutAuthor} and prepared for saving.")
            return True
        else:
            logger.error(f"Audio generation failed for species {species.scientificNameWithoutAuthor}. `generate_audio` returned None or empty.")
            return False

    except Exception as e:
        logger.error(f"An error occurred while generating audio description for {species.scientificNameWithoutAuthor}: {e}", exc_info=True)
        return False
