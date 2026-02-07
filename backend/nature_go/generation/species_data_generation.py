"""Bird-specific generation functions using Gemini API."""

import json
import logging
from generation.gemini import generate_text

logger = logging.getLogger(__name__)


def generate_bird_size(species_name: str) -> float | None:
    """Use Gemini to get approximate body length in cm for a bird species.

    Args:
        species_name: Common or scientific name of the bird species.

    Returns:
        Body length in centimeters, or None if generation fails.
    """
    prompt = f"""What is the typical body length in centimeters for the bird species "{species_name}"?

Body length is measured from bill tip to tail tip.

Return ONLY a JSON object with this exact format:
{{"body_length_cm": <number>}}

Example response for American Robin:
{{"body_length_cm": 25}}"""

    try:
        response = generate_text(prompt)
        data = json.loads(response)
        return float(data.get("body_length_cm"))
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        logger.error(f"Failed to parse bird size response for {species_name}: {e}")
        return None
