import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import edge_tts

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    voice: str = "en-US-AriaNeural"


@router.post("/")
@router.get("/")
async def text_to_speech(text: str = "", voice: str = "en-US-AriaNeural", request_model: TTSRequest = None):
    # 支持 POST (body) 或 GET (query)
    if request_model:
        text = request_model.text
        voice = request_model.voice

    if not text:
        return {"error": "text is required"}

    async def generate():
        tts = edge_tts.Communicate(text, voice)
        async for chunk in tts.stream():
            if chunk["type"] == "audio":
                yield chunk["data"]

    return StreamingResponse(generate(), media_type="audio/mp3")


@router.get("/voices")
def get_voices():
    return {
        "voices": [
            {"code": "en-US-AriaNeural", "name": "美音 - Aria"},
            {"code": "en-GB-SoniaNeural", "name": "英音 - Sonia"},
            {"code": "zh-CN-XiaoxiaoNeural", "name": "中文 - 晓晓"},
        ]
    }