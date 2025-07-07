import React, { useState, useRef, useEffect } from 'react';
import Citations from './Citations';
import Feedback from './Feedback';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: { source: string; snippet: string }[];
}

interface ChatProps {
  sessionId: string;
  messages: Message[];
  onSend: (message: string) => void;
  loading: boolean;
}

const Chat: React.FC<ChatProps> = ({ sessionId, messages, onSend, loading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>{msg.content}</div>
            {msg.role === 'assistant' && msg.citations && (
              <Citations citations={msg.citations} />
            )}
            {msg.role === 'assistant' && (
              <Feedback sessionId={sessionId} question={messages[idx-1]?.content || ''} answer={msg.content} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          className="flex-1 border rounded px-3 py-2 text-gray-900 placeholder-gray-500"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about your manual..."
          disabled={loading}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat; 