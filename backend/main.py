from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent.graph import graph
from gtts import gTTS
import base64, io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentRequest(BaseModel):
    message: str

class AgentResponse(BaseModel):
    intent: str
    message: str
    action: dict
    audio_base64: str | None = None

@app.post("/agent", response_model=AgentResponse)
async def agent_endpoint(req: AgentRequest):
    result = graph.invoke({"user_input": req.message})

    response_message = result.get("response", "I'm not sure how to help with that.")
    intent = result.get("intent", "unknown")
    action = result.get("action", {})

    # Generate TTS audio
    audio_b64 = None
    try:
        tts = gTTS(text=response_message, lang="en")
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        audio_b64 = base64.b64encode(buf.read()).decode("utf-8")
    except Exception as e:
        print(f"TTS generation failed: {e}")

    return AgentResponse(
        intent=intent,
        message=response_message,
        action=action,
        audio_base64=audio_b64,
    )
