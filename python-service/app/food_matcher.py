class FoodMatcher:
    """Base class for FoodLoop food matching."""

    def calculate_match_score(self, listing, organization):
        raise NotImplementedError("Subclasses must implement calculate_match_score")

    def find_matches(self, listing, organizations):
        scored_matches = []

        for organization in organizations:
            score = self.calculate_match_score(listing, organization)

            scored_matches.append({
                "organization": organization,
                "score": score
            })

        return self.rank_matches(scored_matches)

    def rank_matches(self, scored_matches):
        return sorted(
            scored_matches,
            key=lambda item: item["score"],
            reverse=True
        )


class SmartFoodMatcher(FoodMatcher):
    """FoodLoop matching algorithm using OOP."""

    def __init__(self):
        self.weights = {
            "food_type": 40,
            "quantity": 30,
            "location": 30
        }

    def calculate_match_score(self, listing, organization):
        score = 0

        if listing.get("food_type") == organization.get("food_type"):
            score += self.weights["food_type"]

        if listing.get("quantity", 0) >= organization.get("needed_quantity", 0):
            score += self.weights["quantity"]

        if listing.get("location") == organization.get("location"):
            score += self.weights["location"]

        return score


class FoodMatchingService:
    """Service layer that uses the matcher."""

    def __init__(self, matcher=None):
        self.matcher = matcher or SmartFoodMatcher()

    def match_food(self, listing, organizations):
        return self.matcher.find_matches(listing, organizations)
