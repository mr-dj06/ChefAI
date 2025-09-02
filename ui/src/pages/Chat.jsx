import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"
import {
  Send,
  Mic,
  Square,
  ChefHat,
  MessageCircle,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRecord, setAutoRecord] = useState(true);
  const [status, setStatus] = useState(
    "👋 Ready to find amazing recipes! Ask me anything about cooking."
  );
  const [audioEnabled, setAudioEnabled] = useState(true);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const conversationRef = useRef(null);
  // const audioRef = useRef(null);

  // Generate session ID
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );

  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  // Status helper
  const updateStatus = (msg, isError = false) => {
    setStatus(msg);
  };

  // Send text message
  const sendTextMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    const formData = new FormData();
    formData.append("text", userMessage.content);

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    updateStatus("🔍 Searching for delicious recipes...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/agent/chat/${sessionId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      const aiMessage = {
        role: "assistant",
        content: data.ai_text,
        timestamp: Date.now(),
        audioUrl: data.audio_url,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // if (audioEnabled && data.audio_url) {
      //   audioRef.current.src = data.audio_url;
      //   audioRef.current
      //     .play()
      //     .catch((e) => console.log("Audio play failed:", e));
      // }

      updateStatus("✨ Recipe suggestions ready!");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble finding recipes right now. Please try again!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      updateStatus("❌ Something went wrong. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await sendAudioMessage(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      updateStatus("🎙️ Listening... Tell me what you want to cook!");
    } catch (error) {
      console.error("Microphone error:", error);
      updateStatus("❌ Please allow microphone access", true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      updateStatus("🔄 Processing your voice...");
    }
  };

  // Send audio message
  const sendAudioMessage = async (audioBlob) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.wav");
      // formData.append("sessionId", sessionId);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/agent/chat/${sessionId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.transcribed_text) {
        const userMessage = {
          role: "user",
          content: data.transcribed_text,
          timestamp: Date.now(),
          isVoice: true,
        };
        setMessages((prev) => [...prev, userMessage]);
      }

      const aiMessage = {
        role: "assistant",
        content:
          data.ai_text ||
          "I heard you! Let me find some perfect recipes for that.",
        timestamp: Date.now(),
        audioUrl: data.audio_url,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // if (audioEnabled && data.audio_url) {
      //   audioRef.current.src = data.audio_url;
      //   audioRef.current
      //     .play()
      //     .catch((e) => console.log("Audio play failed:", e));
      // }

      updateStatus("✨ Recipe suggestions ready!");
    } catch (error) {
      console.error("Error:", error);
      updateStatus("❌ Voice processing failed. Please try again.", true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // Auto-record after AI response
  const handleAudioEnd = () => {
    if (autoRecord && !isLoading && !isRecording) {
      setTimeout(() => {
        startRecording();
      }, 1000);
    }
  };
  return (
    <div className="flex h-screen">
      {/* <div className="flex-1/4">one</div> */}
      <div className="flex-3/4 chatCon bg-[LightGrey]">
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-3rem)]">
              {/* Recipe Sidebar */}
              <div className="flex flex-col justify-between bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 overflow-y-auto custom-scroll">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-orange-500" />
                    Quick Recipe Ideas
                  </h2>
                  {[
                    { emoji: "🥗", title: "Caesar Salad", time: "10 mins" },
                    {
                      emoji: "🍔",
                      title: "Veg Burger",
                      time: "35 mins",
                    },
                    {
                      emoji: "🍦",
                      title: "Chocolate Ice-Cream",
                      time: "20 mins",
                    },
                    {
                      emoji: "🍰",
                      title: "White Forest Cake",
                      time: "35 mins",
                    },
                    { emoji: "🥪", title: "Grilled Cheese", time: "8 mins" },
                  ].map((recipe, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                      onClick={() =>
                        setInputText(`How to make ${recipe.title}?`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{recipe.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 group-hover:text-orange-600">
                            {recipe.title}
                          </h3>
                          <p className="text-xs text-gray-500">{recipe.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white text-center">
                  <ChefHat className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold mb-1">Pro Tip!</h3>
                  <p className="text-sm text-orange-100">
                    Try voice commands like "Find me a quick breakfast recipe"
                    for faster results!
                  </p>
                </div>
              </div>

              {/* Main Chat Interface */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-y-auto custom-scroll">
                {/* Header */}
                {/* <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-2xl">
                      <ChefHat className="w-8 h-8" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">ChefAI</h1>
                      <p className="text-orange-100">
                        Your Personal Recipe Assistant
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-orange-100 leading-relaxed">
                    Discover amazing recipes, get cooking tips, and create
                    delicious meals with AI-powered culinary expertise!
                  </p>
                </div> */}

                {/* Messages */}
                <div
                  ref={conversationRef}
                  className="flex-1 p-6 overflow-y-auto custom-scroll space-y-4 bg-gradient-to-b from-white/50 to-orange-50/30"
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-full text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-6">
                        <ChefHat className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome to ChefAI!
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        Ask me about any recipe, cooking technique, or
                        ingredient. I'm here to help you create amazing meals!
                      </p>
                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/60 rounded-xl p-3 border border-orange-200">
                          <span className="font-medium">
                            🍝 "How to make pasta carbonara?"
                          </span>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 border border-orange-200">
                          <span className="font-medium">
                            🥘 "Quick dinner ideas for tonight"
                          </span>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 border border-orange-200">
                          <span className="font-medium">
                            🍰 "Easy chocolate cake recipe"
                          </span>
                        </div>
                        <div className="bg-white/60 rounded-xl p-3 border border-orange-200">
                          <span className="font-medium">
                            🥗 "Healthy salad combinations"
                          </span>
                        </div>
                      </div> */}
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.timestamp}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-2xl p-4 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm"
                              : "bg-white shadow-lg border border-gray-200 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`p-1 rounded-full ${
                                message.role === "user"
                                  ? "bg-white/20"
                                  : "bg-orange-100"
                              }`}
                            >
                              {message.role === "user" ? (
                                message.isVoice ? (
                                  <Mic className="w-4 h-4 text-white" />
                                ) : (
                                  <MessageCircle className="w-4 h-4 text-white" />
                                )
                              ) : (
                                <ChefHat className="w-4 h-4 text-orange-500" />
                              )}
                            </div>
                            <span className="text-xs font-medium opacity-75">
                              {message.role === "user" ? "You" : "ChefAI"}
                            </span>
                          </div>
                          <div className="leading-relaxed whitespace-pre-wrap">
                            {message.role==="user" ? message.content : <ReactMarkdown children={message.content} />}
                            {message.role!=="user"&&<audio className="w-full mt-3" onEnded={handleAudioEnd} autoPlay controls controlsList="nodownload" src={message.audioUrl}/>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white shadow-lg border border-gray-200 rounded-2xl rounded-bl-sm p-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                          <span className="text-gray-600">
                            ChefAI is cooking up a response...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/60 border-t border-gray-200/50">
                  {/* Status */}
                  <div
                    className={`text-sm mb-4 p-3 rounded-xl text-center font-medium ${
                      status.includes("❌")
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : status.includes("🎙️")
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-green-50 text-green-600 border border-green-200"
                    }`}
                  >
                    {status}
                  </div>

                  {/* Voice Controls & Settings */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex gap-3">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                          isRecording
                            ? "bg-red-500 text-white hover:bg-red-600 shadow-lg"
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            Record
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* AUTO TURN BTN */}
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRecord}
                          onChange={(e) => setAutoRecord(e.target.checked)}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
                        />
                        Auto-record
                      </label>

                      <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="p-2 rounded-xl bg-orange-100 hover:outline hover:outline-orange-600"
                        title={audioEnabled ? "Disable audio" : "Enable audio"}
                      >
                        {audioEnabled ? (
                          <Volume2 className="w-4 h-4 text-orange-600" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="flex relative gap-3">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about recipes, ingredients, cooking tips... 👨‍🍳"
                      className="w-full p-4 pr-12 rounded-2xl border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none resize-none bg-white/80 backdrop-blur-sm"
                      rows="2"
                    />
                    <button
                      onClick={sendTextMessage}
                      disabled={!inputText.trim() || isLoading}
                      className="absolute bottom-0 right-0 mb-3 mr-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-5 h-5" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden audio element */}
          {/* <audio controls ref={audioRef} onEnded={handleAudioEnd} muted/> */}
        </div>
      </div>
    </div>
  );
}
