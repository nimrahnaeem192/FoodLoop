from fastapi import FastAPI

app = FastAPI(title="FoodLoop Python Matching Service", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "python-service"}
