"use client";

import React from "react";
import { ChatList, Chat } from "./ChatList";

// ----------------------------------------------------------------------
// DATA TYPES
// ----------------------------------------------------------------------

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}



// ----------------------------------------------------------------------
// SUB-COMPONENTS (Continued)
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
      <div className="flex-1 overflow-y-auto w-full hide-scrollbar flex flex-col">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelect={onSelectChat}
        />
      </div>
      <UserProfile />
    </aside>
  );
};

export default Sidebar;
