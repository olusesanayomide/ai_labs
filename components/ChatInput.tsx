"use client";

import React, { useState, useRef, KeyboardEvent } from "react";

export interface ChatInputProps {
  /**
   * Callback fired when the user submits a message.
   */
  onSend: (message: string) => void;
  /**
   * If true, disables the textarea and send button.
   */
  disabled?: boolean;
  /**
   * Placeholder text for the textarea.
   */
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = value.trim();
    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setValue("");

    // Reset textarea height to exactly 1 row after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent default Action inside the browser when pressing Enter
    // Trigger submit only if Shift is NOT held down
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    // Auto-resize algorithm based on scrollHeight
    if (textareaRef.current) {
      // Step 1: Shrink the element back to calculate the *natural* height of text without padding forcing it to stay large
      textareaRef.current.style.height = "auto";
      // Step 2: Use the newly calculated scrollHeight to set the height strictly to what the text requires
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  };

  return (
    <div
      className={`relative w-full rounded-xl border border-slate-300 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 ${
        disabled ? "opacity-60 bg-slate-50" : ""
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Chat message input"
        rows={1}
        className="w-full max-h-48 resize-none bg-transparent py-3 pl-4 pr-14 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed"
      />
      
      {/* Send Button positioned strictly at the bottom-right of the input area */}
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:bg-slate-300 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4" // Ensures the icon size stays consistent
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
