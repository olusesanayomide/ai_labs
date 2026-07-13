import React from "react";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export interface ChatLayoutProps {
  /**
   * The header content (e.g., chat title, export button).
   * Remains fixed at the top.
   */
  headerSlot: React.ReactNode;
  
  /**
   * The main list of chat bubbles.
   * Automatically expands to fill available space and scrolls internally when content overflows.
   */
  messagesSlot: React.ReactNode;
  
  /**
   * The compose text area and send button.
   * Remains fixed at the bottom of the viewport.
   */
  inputSlot: React.ReactNode;
}

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  headerSlot,
  messagesSlot,
  inputSlot,
}) => {
  return (
    <div className="flex flex-col h-full max-h-screen w-full bg-slate-50 relative overflow-hidden">
      {/* 
        HEADER
        `flex-none` ensures the header never shrinks or grows, staying exactly its natural height.
      */}
      <header className="flex-none border-b border-slate-200 bg-white">
        {headerSlot}
      </header>

      {/* 
        MESSAGES (SCROLLABLE AREA)
        `flex-1` tells this container to consume all remaining space between the header and footer.
        `overflow-y-auto` restricts scrolling *only* to this inner container when content exceeds its height.
      */}
      <main className="flex-1 overflow-y-auto">
        {/* An inner container can be added here later if we need strict width limits on messages */}
        {messagesSlot}
      </main>

      {/* 
        INPUT
        `flex-none` ensures the input area retains its natural height and doesn't get crushed by the messages.
      */}
      <footer className="flex-none border-t border-slate-200 bg-white p-4">
        {inputSlot}
      </footer>
    </div>
  );
};

export default ChatLayout;
