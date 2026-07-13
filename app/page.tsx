"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import ChatLayout from "@/components/ChatLayout";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";

// ----------------------------------------------------------------------
// DATA TYPES
// ----------------------------------------------------------------------

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------

const MOCK_CHATS: ChatSession[] = [
  {
    id: "1",
    title: "Welcome to AI Lab",
    messages: [
      {
        id: "m1",
        role: "assistant",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(Date.now() - 60000),
      },
    ],
  },
  {
    id: "2",
    title: "React Server Components",
    messages: [
      {
        id: "m2",
        role: "user",
        content: "What are React Server Components?",
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: "m3",
        role: "assistant",
        content:
          "React Server Components (RSC) allow you to write UI that can be rendered and optionally cached on the server. In Next.js, this is the default for components in the `app` directory. They can fetch data securely and reduce JavaScript bundle sizes.",
        timestamp: new Date(Date.now() - 290000),
      },
    ],
  },
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function Home() {
  // State Ownership:
  // We keep all state in the top-level `Home` component. This enables single-source-of-truth 
  // for all chat history, active view selection, and typing indicators. 
  // By maintaining state here, we can easily pass data down through props to the composed UI components.
  // In the future, this is where we would inject an LLM hook context or external state manager.
  
  const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeChat = chats.find((c) => c.id === activeChatId);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isTyping]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats([newSession, ...chats]);
    setActiveChatId(newSession.id);
  };

  const handleSendMessage = (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Store user message & update title if it's the first actual message
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        
        const isFirstMessage = chat.title === "New Chat";
        const newTitle = isFirstMessage 
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : chat.title;

        return {
          ...chat,
          title: newTitle,
          messages: [...chat.messages, userMessage],
        };
      })
    );

    // Simulate AI thinking and response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I received your message: "${content}". This is a simulated response since no LLM backend is integrated yet.`,
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  // ----------------------------------------------------------------------
  // COMPONENT SLOTS
  // ----------------------------------------------------------------------

  const headerSlot = (
    <div className="flex h-16 w-full items-center justify-between px-6 bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
        {activeChat?.title || "New Chat"}
      </h2>
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <span role="img" aria-hidden="true">⚙️</span>
        </button>
      </div>
    </div>
  );

  const messagesSlot = (
    <div className="flex flex-col py-6 w-full max-w-4xl mx-auto">
      {!activeChat || activeChat.messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
          <span className="text-5xl mb-4 opacity-50">🤖</span>
          <p className="text-lg font-medium">How can I help you today?</p>
          <p className="text-sm mt-2 opacity-75">Send a message to start.</p>
        </div>
      ) : (
        <>
          {activeChat.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} className="h-4" />
        </>
      )}
    </div>
  );

  const inputSlot = (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-2">
      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping}
        placeholder={isTyping ? "AI is typing..." : "Send a message..."}
      />
      <div className="text-center text-xs text-slate-400 font-medium pb-2">
        AI responses are mocked. Ready for real LLM integration.
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-screen w-full bg-slate-50 font-sans">
      {/* 
        The Sidebar is fixed at left-0 and w-64 (16rem).
      */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />

      {/* 
        The main chat view container.
        Since Sidebar is fixed (`absolute/fixed w-64`), we offset this by `ml-64` to prevent overlap.
      */}
      <div className="flex-1 ml-64 flex min-w-0">
        <ChatLayout
          headerSlot={headerSlot}
          messagesSlot={messagesSlot}
          inputSlot={inputSlot}
        />
      </div>
    </div>
  );
}
