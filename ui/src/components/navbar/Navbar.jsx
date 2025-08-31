import React from "react";
// import chefLogo from "/chef.jpg";
import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa6";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 z-10 bg-gradient-to-br from-orange-500 to-red-500 w-full px-8 py-4 flex justify-between items-center text-lg">
      <Link to="/" className="hover-scale bg-white/30 p-3 rounded-2xl">
        <ChefHat className="w-10 h-10 text-white " />
      </Link>
      <div className="flex justify-evenly items-center gap-10">
        <Link to="/" className="text-white hover-line hover-scale">
          Home
        </Link>
        <Link
          to="/chat/:id"
          className="bg-[#F4E7E1] text-[#521C0D] rounded-2xl p-2 hover-scale flex items-center justify-between gap-1"
        >
          Get Started
          <FaRocket />
        </Link>
      </div>
    </div>
  );
}
