from collections import defaultdict
from observation.models import Observation

class BadgeLogic:
    def __init__(self, name, description, levels, icon=None):
        self.name = name
        self.description = description
        self.icon = icon
        self.levels = levels

    def check_user_progress(self, user):
        progress = defaultdict(lambda: {"unlocked": False, "progress": 0})
        for level_name, threshold in self.levels.items():
            observed_count = self.calculate_progress(user)
            progress[level_name]["unlocked"] = observed_count >= threshold
            progress[level_name]["progress"] = observed_count / threshold if threshold > 0 else 1
        return progress

    def calculate_progress(self, user):
        raise NotImplementedError("Subclasses must implement this method")


class SpeciesBadgeLogic(BadgeLogic):
    def __init__(self, name, description, levels, species_list, icon=None):
        super().__init__(name, description, levels, icon)
        self.species_list = species_list

    def calculate_progress(self, user):
        observed_species = Observation.objects.filter(user=user, species__scientificNameWithoutAuthor__in=self.species_list)
        observed_species = set(obs.species.scientificNameWithoutAuthor for obs in observed_species.all())
        return len(observed_species)


class TotalObservationsBadgeLogic(BadgeLogic):
    def calculate_progress(self, user):
        return Observation.objects.filter(user=user).count()

# Badge registry (no need to create the badge instance here anymore)
BADGE_LOGICS = {
    "Corvid Connoisseur": SpeciesBadgeLogic(
        "Corvid Connoisseur", "Observe different corvid species.",
        levels={"Bronze": 1, "Silver": 2, "Gold": 3},
        species_list=["Corvus corax", "Corvus corone", "Pica pica"]
    ),
    "Owl Observer": SpeciesBadgeLogic(
        "Owl Observer", "Observe different owl species.",
        levels={"Bronze": 1, "Silver": 2, "Gold": 3},
        species_list=["Tyto alba", "Bubo bubo", "Otus cyprius"]
    ),
    "Observation Enthusiast": TotalObservationsBadgeLogic(
        "Observation Enthusiast", "Make a large number of observations.",
        levels={"Bronze": 10, "Silver": 50, "Gold": 100}
    )
}