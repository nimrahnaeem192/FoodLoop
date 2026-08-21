from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

from app.food_matcher import FoodMatchingService


app = FastAPI(
    title="FoodLoop Python Matching Service",
    version="0.1.0"
)

matching_service = FoodMatchingService()


class MatchRequest(BaseModel):
    listing: Dict[str, Any]
    organizations: List[Dict[str, Any]]


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "python-service"
    }


@app.post("/match")
def match_food(request: MatchRequest):
    matches = matching_service.match_food(
        request.listing,
        request.organizations
    )

    return {
        "matches": matches
    }
