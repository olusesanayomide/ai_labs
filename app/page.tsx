"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Sidebar } from "@/components/Sidebar";
import ChatLayout from "@/components/ChatLayout";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import type { UIMessage } from "ai";

// ----------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------

/**
 * Extract the concatenated text content from a UIMessage's parts array.
 * AI SDK v7 stores content in `parts: [{ type: 'text', text: '...' }]`,
 * not a flat `content` string.
 */
function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

// ----------------------------------------------------------------------
// DATA TYPES
// ----------------------------------------------------------------------

interface ChatSession {
  id: string;
  title: string;
  messages: UIMessage[];
}

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export default function Home() {
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
    },
  ]);
  const [activeChatId, setActiveChatId] = useState<string>("1");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Vercel AI SDK v7 Integration
  // `sendMessage` replaces the old `append`.
  // `status` replaces the old `isLoading` boolean.
  const { messages, setMessages, sendMessage, status } = useChat({
    id: activeChatId,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Track the streaming messages from `useChat` into our global `chats` array
  useEffect(() => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;

        const isFirstMessage =
          chat.title === "New Chat" && messages.length > 0;
        let newTitle = chat.title;
        if (isFirstMessage) {
          const firstUserMsg = messages.find((m) => m.role === "user");
          if (firstUserMsg) {
            const text = getMessageText(firstUserMsg);
            newTitle = text.slice(0, 30) + (text.length > 30 ? "..." : "");
          }
        }

        return {
          ...chat,
          title: newTitle,
          messages: messages,
        };
      })
    );
  }, [messages, activeChatId]);

  // When switching chats, load the saved messages into useChat
  useEffect(() => {
    const session = chats.find((c) => c.id === activeChatId);
    if (session) {
      setMessages(session.messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId, setMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
    if (!content.trim()) return;

    // AI SDK v7: `sendMessage` accepts `{ text: string }`
    sendMessage({ text: content });
  };

  // ----------------------------------------------------------------------
  // COMPONENT SLOTS
  // ----------------------------------------------------------------------

  const headerSlot = (
    <div className="flex h-16 w-full items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
        {activeChat?.title || "New Chat"}
      </h2>
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Settings"
          title="Settings"
        >
          <span role="img" aria-hidden="true">
            ⚙️
          </span>
        </button>
      </div>
    </div>
  );

  const messagesSlot = (
    <div className="flex flex-col py-6 w-full max-w-4xl mx-auto h-full">
      {!messages || messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400 flex-1">
          <span className="text-5xl mb-4 opacity-50">🤖</span>
          <p className="text-lg font-medium">I&apos;m connected to Gemini!</p>
          <p className="text-sm mt-2 opacity-75">
            Send a message to start our conversation.
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={getMessageText(msg)}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} className="h-4" />
        </>
      )}
    </div>
  );

  const inputSlot = (
    <div className="mx-auto max-w-4xl w-full flex flex-col gap-2">
      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading}
        placeholder={isLoading ? "Gemini is typing..." : "Send a message..."}
      />
      <div className="text-center text-xs text-slate-400 font-medium pb-2">
        Powered by Vercel AI SDK &amp; Google Gemini
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-screen w-full bg-slate-50 font-sans">
      {/* Sidebar fixed left */}
      <Sidebar
        chats={chats.map((c) => ({ id: c.id, title: c.title }))}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />

      {/* Offset by ml-64 to accommodate fixed sidebar */}
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
