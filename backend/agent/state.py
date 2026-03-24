from typing import TypedDict, Optional

class AgentState(TypedDict, total=False):
    user_input: str
    intent: str
    is_safe: bool
    response: str
    action: dict
    # A2A: Emotion context
    mood: str
    # A2A: Multi-intent tracking
    _intents: list
    # A2A: Context history for agent-to-agent communication
    context_history: list
