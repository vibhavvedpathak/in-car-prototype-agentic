"""
MCP-Style Tool Registry
Each tool is a self-describing callable with name, description, and parameter schema.
This follows the Model Context Protocol (MCP) pattern for vehicle control capabilities.
"""

from dataclasses import dataclass, field
from typing import Callable, Any

@dataclass
class MCPTool:
    """A self-describing tool following the MCP pattern."""
    name: str
    description: str
    parameters: dict
    execute: Callable

# ─── Mood-to-Music Mapping ───
MOOD_MUSIC_MAP = {
    "bored": {
        "songs": [
            {"song": "Uptown Funk", "artist": "Bruno Mars"},
            {"song": "Blinding Lights", "artist": "The Weeknd"},
            {"song": "Levitating", "artist": "Dua Lipa"},
        ],
        "genres": ["pop", "dance", "electronic"],
        "climate_suggestion": None,
        "message": "Looks like you need some energy! Let me play something upbeat to liven things up. 🎶"
    },
    "tired": {
        "songs": [
            {"song": "Weightless", "artist": "Marconi Union"},
            {"song": "Clair de Lune", "artist": "Debussy"},
            {"song": "Sunset Lover", "artist": "Petit Biscuit"},
        ],
        "genres": ["ambient", "classical", "chillout"],
        "climate_suggestion": 19,
        "message": "You sound tired. I'll play something calming and cool the cabin to 19°C to help you stay alert. Take a break if you need to! 💤"
    },
    "stressed": {
        "songs": [
            {"song": "Breathe Me", "artist": "Sia"},
            {"song": "Lofi Hip Hop", "artist": "ChilledCow"},
            {"song": "River Flows In You", "artist": "Yiruma"},
        ],
        "genres": ["lo-fi", "ambient", "piano"],
        "climate_suggestion": 21,
        "message": "I can sense you're stressed. Let me put on some relaxing lo-fi beats and set a comfortable temperature. Everything will be okay. 🧘"
    },
    "happy": {
        "songs": [
            {"song": "Happy", "artist": "Pharrell Williams"},
            {"song": "Walking on Sunshine", "artist": "Katrina and the Waves"},
            {"song": "Good as Hell", "artist": "Lizzo"},
        ],
        "genres": ["pop", "feel-good", "dance"],
        "climate_suggestion": None,
        "message": "Great to hear you're feeling happy! Let me match that vibe with some feel-good music! 🎉"
    },
    "sad": {
        "songs": [
            {"song": "Someone Like You", "artist": "Adele"},
            {"song": "Fix You", "artist": "Coldplay"},
            {"song": "Let It Be", "artist": "The Beatles"},
        ],
        "genres": ["acoustic", "soft rock", "soul"],
        "climate_suggestion": 22,
        "message": "I'm here for you. Let me play something comforting. Things will get better. 💙"
    },
    "excited": {
        "songs": [
            {"song": "Thunder", "artist": "Imagine Dragons"},
            {"song": "Titanium", "artist": "David Guetta"},
            {"song": "Stronger", "artist": "Kanye West"},
        ],
        "genres": ["electronic", "rock", "hip-hop"],
        "climate_suggestion": None,
        "message": "Love that energy! Here's a powerful track to keep you pumped! ⚡"
    },
}

# ─── Mood Detection Keywords ───
MOOD_KEYWORDS = {
    "bored": ["bored", "boring", "nothing to do", "dull", "monotonous", "uninterested"],
    "tired": ["tired", "sleepy", "exhausted", "drowsy", "fatigue", "worn out", "yawning"],
    "stressed": ["stressed", "anxious", "nervous", "overwhelm", "tense", "pressure", "worried"],
    "happy": ["happy", "great", "wonderful", "amazing", "fantastic", "good mood", "cheerful", "joyful"],
    "sad": ["sad", "down", "depressed", "unhappy", "melancholy", "blue", "upset", "crying"],
    "excited": ["excited", "pumped", "thrilled", "hyped", "energized", "fired up", "stoked"],
}

import random

def detect_mood(user_input: str) -> str | None:
    """Detect the driver's mood from their message."""
    text = user_input.lower()
    for mood, keywords in MOOD_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return mood
    return None

def get_mood_recommendation(mood: str) -> dict:
    """Get music and climate recommendations for a detected mood."""
    config = MOOD_MUSIC_MAP.get(mood, MOOD_MUSIC_MAP["happy"])
    song_choice = random.choice(config["songs"])
    return {
        "mood": mood,
        "song": song_choice["song"],
        "artist": song_choice["artist"],
        "climate_temp": config["climate_suggestion"],
        "message": config["message"],
        "genres": config["genres"],
    }

# ─── MCP Tool Definitions ───

def _execute_navigate(params: dict) -> dict:
    return {"type": "navigation", "destination": params.get("destination", "Unknown")}

def _execute_climate(params: dict) -> dict:
    return {"type": "climate", "temperature": params.get("temperature", 22)}

def _execute_media(params: dict) -> dict:
    cmd = params.get("command", "play")
    if cmd == "pause":
        return {"type": "media", "command": "pause", "isPlaying": False}
    return {
        "type": "media",
        "command": "play",
        "song": params.get("song", "Neon Nights"),
        "artist": params.get("artist", "Synthwave FM"),
        "isPlaying": True,
    }

def _execute_car_status(params: dict) -> dict:
    return {"type": "car", "battery": 78, "range": 245, "speed": 60}

def _execute_mood(params: dict) -> dict:
    mood = params.get("mood", "happy")
    rec = get_mood_recommendation(mood)
    return {
        "type": "emotion",
        "mood": rec["mood"],
        "song": rec["song"],
        "artist": rec["artist"],
        "climate_temp": rec["climate_temp"],
    }

# ─── Tool Registry ───
TOOL_REGISTRY: list[MCPTool] = [
    MCPTool(
        name="navigate",
        description="Set the vehicle's navigation destination",
        parameters={"destination": {"type": "string", "description": "The target location"}},
        execute=_execute_navigate,
    ),
    MCPTool(
        name="climate",
        description="Adjust the vehicle's cabin temperature",
        parameters={"temperature": {"type": "integer", "description": "Target temperature in Celsius"}},
        execute=_execute_climate,
    ),
    MCPTool(
        name="media",
        description="Control music playback — play, pause, or search for a song",
        parameters={
            "command": {"type": "string", "enum": ["play", "pause"]},
            "song": {"type": "string", "description": "Song name"},
            "artist": {"type": "string", "description": "Artist name"},
        },
        execute=_execute_media,
    ),
    MCPTool(
        name="car_status",
        description="Get the current vehicle status including battery, range, and speed",
        parameters={},
        execute=_execute_car_status,
    ),
    MCPTool(
        name="mood_music",
        description="Detect the driver's emotional state and recommend appropriate music and climate settings",
        parameters={"mood": {"type": "string", "enum": ["bored", "tired", "stressed", "happy", "sad", "excited"]}},
        execute=_execute_mood,
    ),
]

def get_tool(name: str) -> MCPTool | None:
    """Look up a tool by name from the registry."""
    for tool in TOOL_REGISTRY:
        if tool.name == name:
            return tool
    return None

def list_tools() -> list[dict]:
    """Return all available tools as serializable dicts (for MCP discovery)."""
    return [
        {"name": t.name, "description": t.description, "parameters": t.parameters}
        for t in TOOL_REGISTRY
    ]
