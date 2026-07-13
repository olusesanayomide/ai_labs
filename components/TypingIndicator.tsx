import React from "react";

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const TypingIndicator: React.FC = () => {
  return (
    <div 
      className="flex w-full justify-start mb-6 px-4" 
      aria-label="AI is typing" 
      role="status"
    >
      {/* 
        AVATAR (Matching Assistant MessageBubble) 
        Hidden on mobile (sm:flex) to save space, matching the bubble design.
      */}
      <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 select-none hidden sm:flex">
        🤖
      </div>

      {/* Tying Bubble Container */}
      <div className="border border-slate-200 bg-white shadow-sm rounded-2xl rounded-bl-sm px-5 py-4 flex items-center min-h-[52px]">
        <div className="flex space-x-1.5 items-center justify-center">
          {/* 
            Native Tailwind animate-bounce class is utilized here.
            The staggered animation delays create the "wave" typing effect.
          */}
          <div 
            className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" 
            style={{ animationDelay: "0ms" }}
          ></div>
          <div 
            className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" 
            style={{ animationDelay: "150ms" }}
          ></div>
          <div 
            className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" 
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
