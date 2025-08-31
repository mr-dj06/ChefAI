# 🧑‍🍳 ChefAI  

**ChefAI** is your personal **AI-powered culinary assistant** that helps you with all things food and cooking.  
You can chat with it using **text or voice**, and it will provide **recipes, cooking tips, and culinary wisdom**.  

ChefAI is designed to be your **friendly chef companion**, remembering your conversation history and even **speaking its responses aloud** for an engaging, interactive experience — always sticking to the delicious world of food! 🍲  

---

## ✨ Features  
- 🗣️ **Voice + Text Chat** with your AI chef  
- 🍳 **Recipe Generation** based on your ingredients or cravings  
- 🍽️ **Cooking Tips & Techniques** explained step by step  
- 🧠 **Context Awareness** (remembers your ongoing conversation)  
- 🔊 **Text-to-Speech (TTS)** responses for an immersive experience  
- 🎨 **Modern UI** built with React + Tailwind  

---

## 🛠️ Technologies Used  

### Backend  
- **Python** (FastAPI)  
- **Google Generative AI (Gemini API)** – powers ChefAI’s intelligence  
- **Murf TTS API** – for natural voice output  
- **dotenv** – for environment management  

### Frontend  
- **React.js**  
- **Tailwind CSS** – modern styling  
- **React Router DOM** – navigation  
- **Lucide React** – icons  

---

## 🚀 Getting Started  

### 1️⃣ Backend Setup (FastAPI)  
1. Create a virtual environment and install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```  

2. Add your API keys in a `.env` file:  
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ASSEMBLY_API_KEY=your_assemblyai_api_key_here
   MURF_API_KEY=your_murf_api_key_here
   ```

3. Run the FastAPI server:  
   ```bash
   uvicorn main:app --reload
   ```

### 2️⃣ Frontend Setup (React)  
1. Navigate to the frontend directory:  
   ```bash
   cd ui
   npm install
   npm start
   ```  

---

## 📂 Project Structure  
```
ChefAI/
│── backend/
│   ├── main.py              # FastAPI entry point
│   ├── services/
│   │   ├── tts_murf.py      # Murf TTS integration
│   │   ├── prompt.py        # Chef persona & prompts
│   └── ...
│
│── frontend/
│   ├── src/
│   │   ├── App.jsx          # React entry point
|   |   |── main.jsx 
│   │   ├── components/      # UI Components
│   │   ├── pages/           # React Router pages
│   └── ...
│
└── README.md
```

---


