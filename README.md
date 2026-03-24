# 🚗 In-Car Multimodal Agentic AI Prototype

A sophisticated, AI-first in-car dashboard prototype featuring a multimodal Multi-Agent orchestrator. This project demonstrates modern Agent-to-Agent (A2A) communication patterns and Model Context Protocol (MCP) tool integration to create a seamless, context-aware driving assistant.

![In-Car Dashboard Demo](https://raw.githubusercontent.com/placeholder-demo.png) *(Add your screenshot here)*

## 🌟 Key Features

- **Multimodal Interaction**: Supports text and voice-to-text (Web Speech API) input with real-time text-to-speech (gTTS) responses.
- **Agentic Orchestration (A2A)**: Powered by **LangGraph**, the system uses a central "Planner" agent to delegate tasks to specialized agents (Navigation, Media, Climate, etc.).
- **Emotional Intelligence**: Features a dedicated Emotion Agent that detects driver mood and coordinates with other agents (e.g., suggesting calming music and cooling the cabin when "stressed").
- **MCP-Style Tools**: Implements self-describing vehicle control tools (Climate, Navigation, Car Status) following the Model Context Protocol pattern.
- **Dynamic 3D Interface**: High-performance dashboard built with **Next.js** and **React Three Fiber**, featuring a real-time 3D car model.
- **Micro-Animations**: Glassmorphism UI with smooth transitions and interactive widgets.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **3D Rendering**: React Three Fiber / Three.js
- **State Management**: Zustand
- **Voice**: Web Speech API (STT) & Audio Base64 Playback (TTS)

### Backend
- **Framework**: FastAPI (Python)
- **Orchestration**: LangGraph (Stateful Multi-Agent workflows)
- **Data Validation**: Pydantic
- **Audio Generation**: gTTS (Google Text-to-Speech)

## 🧠 Agent Architecture

The system utilizes a directed acyclic graph (DAG) to manage state and logic flow:

1.  **Safety Node**: Validates requests for ethical and safety compliance.
2.  **Planner Node**: Analyzes intent and routes to the appropriate specialist.
3.  **Specialist Agents**:
    - **Navigation Agent**: Handles destination and routing logic.
    - **Media Agent**: Controls playback and music searches.
    - **Climate Agent**: Adjusts cabin temperature preferences.
    - **Car Status Agent**: Monitors battery, range, and speed.
    - **Emotion Agent**: (A2A) Orchestrates media and climate based on driver sentiment.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Setup

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd in-car-prototype-py
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    python main.py
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

4.  **Access the Dashboard**:
    Open [http://localhost:3000](http://localhost:3000) (Next.js) and ensure the FastAPI server is running on [http://localhost:8000](http://localhost:8000).

## 📖 Use Cases

- **Scenario**: *"I'm feeling really stressed."*
  - **A2A Flow**: Planner → Emotion Agent → Media Agent (Play Lo-Fi) + Climate Agent (Set to 21°C).
- **Scenario**: *"Drive me to the BMW Museum in Munich."*
  - **Flow**: Planner → Navigation Agent → Dashboard Map Update.
- **Scenario**: *"Check my car status and play some Dua Lipa."*
  - **Multi-Intent Flow**: Planner → Multi-Agent Dispatcher → Car Status (78% battery) + Media (Playing Levitating).

## 📜 Credits & Attributions

- **3D Car Model**: ["Cyberpunk car"](https://skfb.ly/6QUAI) by [4d_Bob](https://sketchfab.com/4d_Bob) is licensed under [Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
