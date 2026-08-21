class FoodMatcher:
    """Deterministic food matching. Implementation deferred."""

    def calculate_match_score(self, listing, organization):
        raise NotImplementedError

    def find_matches(self, listing, organizations):
        raise NotImplementedError

    def rank_matches(self, scored_matches):
        raise NotImplementedError
