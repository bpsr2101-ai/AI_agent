"use client";
import React, { useState, useEffect } from "react";
import Chat, { Message } from "../components/Chat";
import FileUpload from "../components/FileUpload";
import { v4 as uuidv4 } from "uuid";

const getSessionId = () => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

export default function HomePage() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const handleSend = async (text: string) => {
    setMessages((msgs) => [...msgs, { role: "user", content: text }]);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, session_id: sessionId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: data.answer, citations: data.citations },
      ]);
    } catch (e: any) {
      setError(e.message || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">AI Instruction Manual Chatbot</h1>
        <p className="mb-4 text-gray-600 text-center">Upload your device manual and ask questions!</p>
        <FileUpload onUpload={handleUpload} loading={uploading} />
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        <Chat
          sessionId={sessionId}
          messages={messages}
          onSend={handleSend}
          loading={loading}
        />
      </div>
      <div className="bg-blue-500 text-white p-4 rounded">If you see a blue box, Tailwind is working!</div>
    </main>
  );
}
