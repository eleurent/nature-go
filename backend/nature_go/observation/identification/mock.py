from observation.models import Species, IdentificationCandidate, IdentificationResponse

def bird_identify_mock(image_path: str, max_count: int = 1000) -> IdentificationResponse:
    """Mock API to identify a bird

    Args:
        image_path (str): path to an image file

    Returns:
        IdentificationResponse: mock API response
    """
    del image_path
    bird_species = Species.objects.filter(type=Species.BIRD_TYPE).order_by('rarity_gpt')[:max_count]
    bird_species = list(bird_species)

    candidates = [IdentificationCandidate(species=species, confidence=1 / len(bird_species)) for species in bird_species]
    response = IdentificationResponse(candidates=candidates)
    return response

