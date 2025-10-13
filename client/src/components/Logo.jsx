import React from "react";

function Logo() {
  return (
    <div className="inline-block">
      <h1
        className="text-2xl md:text-3xl font-extrabold tracking-tight
                   bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   bg-clip-text text-transparent
                   hover:from-pink-500 hover:to-indigo-500
                   transition-all duration-500 cursor-pointer
                   whitespace-nowrap"
      >
        MediVerse
      </h1>
    </div>
  );
}

export default Logo;
