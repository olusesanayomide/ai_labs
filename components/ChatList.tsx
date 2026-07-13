"use client";

import React from "react";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export interface Chat {
  id: string;
  title: string;
}

export interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export interface ChatListProps {
  /**
   * The list of conversation history metadata.
   */
  chats: Chat[];
  /**
   * The ID of the currently selected conversation.
   */
  activeChatId?: string;
  /**
   * Callback fired when a conversation is clicked.
   */
  onSelect: (chatId: string) => void;
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

/**
 * A highly focused, reusable component representing a single conversation row.
 */
export const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isActive,
  onClick,
}) => {
  return (
    <li className="mb-1 last:mb-0">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isActive
            ? "bg-slate-800 text-white font-medium shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        <span 
          role="img" 
          aria-hidden="true" 
          className={`flex-shrink-0 text-base ${isActive ? "opacity-100" : "opacity-70"}`}
        >
          💬
        </span>
        <span className="truncate flex-1">{chat.title}</span>
      </button>
    </li>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelect,
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center text-sm text-slate-500">
        <p>No conversations yet.</p>
      </div>
    );
  }

  return (
    <nav 
      // Tailwind's native hide-scrollbar trick works best strictly on y-axis containers
      className="flex-1 overflow-y-auto px-2 py-2"
      aria-label="Chat History"
    >
      <ul className="flex flex-col m-0 p-0 list-none">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onSelect(chat.id)}
          />
        ))}
      </ul>
    </nav>
  );
};

export default ChatList;
