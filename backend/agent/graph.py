from langgraph.graph import StateGraph, END
from .state import AgentState
from .nodes import (
    safety_node, planner_node, climate_agent, navigation_agent,
    media_agent, car_status_agent, multi_agent, fallback_node,
    emotion_agent
)

def build_graph():
    workflow = StateGraph(AgentState)
    
    # ─── Core nodes ───
    workflow.add_node("safety", safety_node)
    workflow.add_node("planner", planner_node)
    
    # ─── MCP tool-backed agents ───
    workflow.add_node("climate", climate_agent)
    workflow.add_node("navigation", navigation_agent)
    workflow.add_node("media", media_agent)
    workflow.add_node("car", car_status_agent)
    workflow.add_node("multi", multi_agent)
    workflow.add_node("fallback", fallback_node)
    
    # ─── A2A Emotion Agent ───
    workflow.add_node("emotion", emotion_agent)
    
    # ─── Edges ───
    workflow.set_entry_point("safety")
    workflow.add_edge("safety", "planner")
    
    def route(state: AgentState):
        intent = state.get("intent")
        if intent == "climate": return "climate"
        if intent == "navigation": return "navigation"
        if intent == "media": return "media"
        if intent == "car": return "car"
        if intent == "multi": return "multi"
        if intent == "emotion": return "emotion"
        if intent == "unsafe": return END
        return "fallback"
        
    workflow.add_conditional_edges(
        "planner",
        route,
        {
            "climate": "climate",
            "navigation": "navigation",
            "media": "media",
            "car": "car",
            "multi": "multi",
            "emotion": "emotion",
            END: END,
            "fallback": "fallback"
        }
    )
    
    workflow.add_edge("climate", END)
    workflow.add_edge("navigation", END)
    workflow.add_edge("media", END)
    workflow.add_edge("car", END)
    workflow.add_edge("multi", END)
    workflow.add_edge("emotion", END)
    workflow.add_edge("fallback", END)
    
    return workflow.compile()

graph = build_graph()
