import httpx
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from app.config import UNSPLASH_ACCESS_KEY

router = APIRouter()


class ImageRequest(BaseModel):
    query: str


@router.post("/")
async def get_image(request: ImageRequest):
    if not UNSPLASH_ACCESS_KEY:
        raise HTTPException(status_code=500, detail="Unsplash API key not configured")

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.unsplash.com/search/photos",
            params={"query": request.query, "per_page": 1, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch image")

    data = response.json()
    if not data.get("results"):
        raise HTTPException(status_code=404, detail="No image found")

    photo = data["results"][0]
    return {
        "url": photo["urls"]["regular"],
        "thumb_url": photo["urls"]["thumb"],
        "credit": {
            "name": photo["user"]["name"],
            "link": photo["user"]["links"]["html"],
        },
    }