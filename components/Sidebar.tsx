"use client";

import React from "react";

// ----------------------------------------------------------------------
// DATA TYPES
// ----------------------------------------------------------------------

export interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
}

interface ChatItemProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

const Logo: React.FC = () => (
  <div className="flex items-center gap-2 px-4 py-6">
    <span className="text-2xl" role="img" aria-label="Robot">
      🤖
    </span>
    <h1 className="text-xl font-bold tracking-tight text-slate-100">AI Lab</h1>
  </div>
);

const NewChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="px-4 pb-4">
    <button
      onClick={onClick}
      className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      aria-label="Start a new chat"
    >
      [ + New Chat ]
    </button>
  </div>
);

const ChatItem: React.FC<ChatItemProps> = ({ title, active, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          active
            ? "bg-slate-800 text-white font-medium shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`}
        aria-current={active ? "page" : undefined}
      >
        <span role="img" aria-label="Chat Bubble">
          💬
        </span>
        <span className="truncate">{title}</span>
      </button>
    </li>
  );
};

const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
}) => (
  <nav className="flex-1 overflow-y-auto px-2 py-4 hide-scrollbar">
    <ul className="flex flex-col gap-1 space-y-1">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          title={chat.title}
          active={chat.id === activeChatId}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </ul>
  </nav>
);

const UserProfile: React.FC = () => (
  <div className="border-t border-slate-800 p-4">
    <div className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-slate-800 cursor-pointer">
      <span className="text-lg" role="img" aria-label="User">
        👤
      </span>
      <span className="text-sm font-medium text-slate-300">Ayomide</span>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
}) => {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-slate-900 text-slate-100 shadow-xl border-r border-slate-800">
      <Logo />
      <NewChatButton onClick={onNewChat} />
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
      />
      <UserProfile />
    </aside>
  );
};

export default Sidebar;
