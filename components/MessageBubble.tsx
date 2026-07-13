import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export interface MessageBubbleProps {
  /**
   * Identifies who sent the message, determining alignment and styling.
   */
  role: "user" | "assistant";
  
  /**
   * The raw markdown content of the message.
   */
  content: string;
  
  /**
   * Optional timestamp of when the message was sent.
   */
  timestamp?: Date;
}

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
}) => {
  const isUser = role === "user";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6 px-4`}>
      {/* 
        AVATAR (For Assistant) 
        In V2, this could accept an explicit avatar icon as a prop or render a user profile image 
      */}
      {!isUser && (
        <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 select-none hidden sm:flex">
          🤖
        </div>
      )}

      <div
        className={`relative max-w-[85%] md:max-w-[75%] lg:max-w-[65%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "border border-slate-200 bg-white text-slate-800 shadow-sm rounded-bl-sm"
        }`}
      >
        {/* Render Markdown Content */}
        <div 
          className={`prose prose-sm md:prose-base max-w-none break-words ${
            isUser ? "prose-invert" : ""
          }`}
        >
          <ReactMarkdown
            components={{
              // Override specific markdown elements for tight visual consistency
              p: ({ node, ...props }) => <p className="leading-relaxed whitespace-pre-wrap m-0 mb-4 last:mb-0" {...props} />,
              a: ({ node, ...props }) => (
                <a className="underline hover:opacity-80 transition-opacity" target="_blank" rel="noreferrer" {...props} />
              ),
              code: ({ inline, className, children, ...props }: any) => {
                const isInline = inline || !className;
                return isInline ? (
                  <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-sm" {...props}>
                    {children}
                  </code>
                ) : (
                  <div className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-200 shadow-inner">
                    <code {...props}>{children}</code>
                  </div>
                );
              },
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 last:mb-0 space-y-1" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 last:mb-0 space-y-1" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Timestamp Footer */}
        {timestamp && (
          <div
            className={`mt-2 flex items-center text-xs ${
              isUser ? "text-indigo-200 justify-end" : "text-slate-400 justify-start"
            }`}
          >
            {mounted ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(timestamp) : '\u00A0'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
