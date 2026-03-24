import re
from .state import AgentState
from .tools import detect_mood, get_mood_recommendation

def safety_node(state: AgentState) -> AgentState:
    """Validates the user's request for safety concerns."""
    user_input = state.get("user_input", "").lower()
    unsafe_keywords = ["crash", "explode", "hack", "unlock while driving", "disable brakes"]
    
    for keyword in unsafe_keywords:
        if keyword in user_input:
            return {
                **state,
                "is_safe": False,
                "intent": "unsafe",
                "response": "I'm sorry, I can't assist with that request for safety reasons.",
                "action": {}
            }
    return {**state, "is_safe": True}

def planner_node(state: AgentState) -> AgentState:
    """Routes the user's intent to the correct agent.
    
    This is the A2A orchestrator — it analyzes the input and determines
    which specialist agent(s) should handle the request.
    """
    user_input = state.get("user_input", "").lower()
    
    # ─── Check for emotion/mood first (A2A: emotion detection) ───
    detected_mood = detect_mood(user_input)
    if detected_mood:
        # Check if there are also other intents alongside the mood
        intents_found = []
        if any(w in user_input for w in ["temperature", "climate", "heat", "cool", "warm", "cold", "ac"]):
            intents_found.append("climate")
        if any(w in user_input for w in ["navigate", "drive", "go to", "directions", "route"]):
            intents_found.append("navigation")
        if any(w in user_input for w in ["play", "music", "song", "pause", "stop music", "track"]):
            intents_found.append("media")
        
        # Pure emotion intent — let the emotion agent handle everything
        return {**state, "intent": "emotion", "mood": detected_mood}
    
    # ─── Standard intent detection ───
    intents_found = []
    if any(w in user_input for w in ["temperature", "climate", "heat", "cool", "warm", "cold", "ac"]):
        intents_found.append("climate")
    if any(w in user_input for w in ["navigate", "drive", "go to", "directions", "route"]):
        intents_found.append("navigation")
    if any(w in user_input for w in ["play", "music", "song", "pause", "stop music", "track"]):
        intents_found.append("media")
    if any(w in user_input for w in ["battery", "range", "speed", "status", "car info"]):
        intents_found.append("car")
    
    if len(intents_found) > 1:
        return {**state, "intent": "multi", "_intents": intents_found}
    elif len(intents_found) == 1:
        return {**state, "intent": intents_found[0]}
    else:
        return {**state, "intent": "fallback"}

def climate_agent(state: AgentState) -> AgentState:
    """MCP Tool: climate — Handles climate control requests."""
    user_input = state.get("user_input", "")
    temp_match = re.search(r'(\d+)', user_input)
    temp = int(temp_match.group(1)) if temp_match else 22
    
    return {
        **state,
        "response": f"Setting the temperature to {temp}°C.",
        "action": {"type": "climate", "temperature": temp},
        "context_history": state.get("context_history", []) + [
            {"agent": "climate", "action": "set_temperature", "value": temp}
        ],
    }

def navigation_agent(state: AgentState) -> AgentState:
    """MCP Tool: navigate — Handles navigation requests."""
    user_input = state.get("user_input", "").lower()
    
    destination = "Unknown"
    for prefix in ["navigate to ", "drive to ", "go to ", "directions to ", "route to "]:
        if prefix in user_input:
            destination = user_input.split(prefix, 1)[1].strip().rstrip(".")
            break
    
    return {
        **state,
        "response": f"Setting route and engaging navigation mode to {destination}.",
        "action": {"type": "navigation", "destination": destination},
        "context_history": state.get("context_history", []) + [
            {"agent": "navigation", "action": "set_destination", "value": destination}
        ],
    }

def media_agent(state: AgentState) -> AgentState:
    """MCP Tool: media — Handles media/music requests."""
    user_input = state.get("user_input", "").lower()
    
    if "pause" in user_input or "stop" in user_input:
        return {
            **state,
            "response": "Pausing the music.",
            "action": {"type": "media", "command": "pause", "isPlaying": False},
            "context_history": state.get("context_history", []) + [
                {"agent": "media", "action": "pause"}
            ],
        }
    
    song = "Neon Nights"
    artist = "Synthwave FM"
    
    if "play " in user_input:
        query = user_input.split("play ", 1)[1].strip().rstrip(".")
        if " by " in query:
            parts = query.split(" by ", 1)
            song = parts[0].strip().title()
            artist = parts[1].strip().title()
        else:
            song = query.strip().title()
            artist = "Unknown Artist"
    
    return {
        **state,
        "response": f"Now playing {song} by {artist}.",
        "action": {"type": "media", "command": "play", "song": song, "artist": artist, "isPlaying": True},
        "context_history": state.get("context_history", []) + [
            {"agent": "media", "action": "play", "song": song, "artist": artist}
        ],
    }

def car_status_agent(state: AgentState) -> AgentState:
    """MCP Tool: car_status — Handles car status requests."""
    return {
        **state,
        "response": "Your car's battery is at 78%, with an estimated range of 245 km. Current speed is 60 km/h.",
        "action": {"type": "car", "battery": 78, "range": 245, "speed": 60},
        "context_history": state.get("context_history", []) + [
            {"agent": "car_status", "action": "report"}
        ],
    }

def emotion_agent(state: AgentState) -> AgentState:
    """A2A Emotion Agent — Detects driver mood and delegates to media + climate agents.
    
    This demonstrates Agent-to-Agent (A2A) communication:
    1. The planner detects an emotional intent and routes here.
    2. This agent analyzes the mood and builds a compound action.
    3. It communicates with the media and climate sub-systems to set
       music and temperature appropriate for the driver's emotional state.
    """
    mood = state.get("mood", "happy")
    rec = get_mood_recommendation(mood)
    
    # Build compound action — A2A delegation to media + climate agents
    actions = []
    
    # Always play mood-appropriate music
    actions.append({
        "type": "media",
        "command": "play",
        "song": rec["song"],
        "artist": rec["artist"],
        "isPlaying": True,
    })
    
    # Optionally adjust climate based on mood
    if rec["climate_temp"] is not None:
        actions.append({
            "type": "climate",
            "temperature": rec["climate_temp"],
        })
    
    return {
        **state,
        "response": rec["message"],
        "action": {"type": "emotion", "mood": mood, "actions": actions},
        "context_history": state.get("context_history", []) + [
            {"agent": "emotion", "detected_mood": mood, "delegated_to": ["media"] + (["climate"] if rec["climate_temp"] else [])},
        ],
    }

def multi_agent(state: AgentState) -> AgentState:
    """Handles multiple intents in a single request via A2A delegation."""
    intents = state.get("_intents", [])
    responses = []
    combined_action = {"type": "multi", "actions": []}
    
    for intent in intents:
        if intent == "climate":
            sub = climate_agent(state)
        elif intent == "navigation":
            sub = navigation_agent(state)
        elif intent == "media":
            sub = media_agent(state)
        elif intent == "car":
            sub = car_status_agent(state)
        else:
            continue
        responses.append(sub.get("response", ""))
        combined_action["actions"].append(sub.get("action", {}))
    
    return {
        **state,
        "response": " ".join(responses),
        "action": combined_action,
        "context_history": state.get("context_history", []) + [
            {"agent": "multi", "delegated_intents": intents}
        ],
    }

def fallback_node(state: AgentState) -> AgentState:
    """Handles unrecognized intents."""
    return {
        **state,
        "response": "I'm not sure how to help with that. You can ask me to navigate, control climate, play music, or tell me how you're feeling!",
        "action": {},
    }
