NATURALIST_TITLES = {
    1: 'Scout',
    2: 'Field Assistant',
    3: 'Apprentice Naturalist',
    4: 'Undergraduate',
    5: 'PhD Candidate',
    6: 'Postdoctoral Fellow',
    7: 'Assistant Professor',
    8: 'Associate Professor',
    9: 'Professor',
    10: 'Distinguished Professor',
}


def get_naturalist_title(level: int) -> str:
    if level <= 1:
        return NATURALIST_TITLES[1]
    return NATURALIST_TITLES.get(level, NATURALIST_TITLES[10])
