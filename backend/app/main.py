from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import translate, tts, image

app = FastAPI(title="Wonder Island API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://english-study-phi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate.router, prefix="/api/translate", tags=["translate"])
app.include_router(tts.router, prefix="/api/tts", tags=["tts"])
app.include_router(image.router, prefix="/api/image", tags=["image"])