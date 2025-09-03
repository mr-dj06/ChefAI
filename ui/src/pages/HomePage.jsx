import React, { useState } from "react";
import { LandingEffect } from "../components";
import { useNavigate } from "react-router-dom";
import { FaRocket } from "react-icons/fa6";

export default function HomePage() {
  const [sessionId] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/chat/${sessionId}`);
  };
  return (
    <div className="max-w-full h-screen  flex">
      <LandingEffect />
      <div className="getStarted bg-orange-200 flex-1/2 flex justify-center items-center">
        <button
          className="bg-slate-800 text-white p-3.5 rounded-xl flex items-center justify-center gap-3 text-2xl hover-scale cursor-pointer 000B58"
          onClick={handleClick}
        >
          Get Started
          <FaRocket />
        </button>
      </div>
    </div>
  );
}
