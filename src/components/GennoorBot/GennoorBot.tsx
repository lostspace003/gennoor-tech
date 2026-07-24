'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  feedback?: 'positive' | 'negative'
}

export default function GennoorBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m GennoorBot, your AI assistant. How can I help you with lead management today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your request. Let me help you with that. Based on your leads data, I can provide insights and recommendations.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, feedback } : msg
    ))
  }

  return (
    <>
      {/* Floating Bot Button - Microsoft Copilot Style */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 group hover:scale-105 transition-all duration-300 z-50"
          aria-label="Open GennoorBot"
        >
          <div className="relative">
            {/* Animated Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

            {/* Bot Icon Container */}
            <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4 rounded-2xl shadow-2xl">
              {/* Custom GennoorBot Icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="text-white"
              >
                {/* Outer Ring */}
                <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" className="animate-pulse" />

                {/* Core Circle */}
                <circle cx="14" cy="14" r="8" fill="currentColor" fillOpacity="0.9" />

                {/* AI Brain Pattern */}
                <path
                  d="M10 14 L14 10 L18 14 L14 18 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  className="animate-pulse"
                  strokeOpacity="0.5"
                />

                {/* Center Dot */}
                <circle cx="14" cy="14" r="2" fill="white" />

                {/* Connection Points */}
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="20" cy="14" r="1" fill="currentColor" />
                <circle cx="14" cy="8" r="1" fill="currentColor" />
                <circle cx="14" cy="20" r="1" fill="currentColor" />
              </svg>

              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            GennoorBot AI Assistant
          </div>
        </button>
      )}

      {/* Chat Panel - Smooth Slide from Right with Better Animation */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-96 bg-white rounded-2xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 overflow-hidden ${
          isOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[calc(100%+2rem)] opacity-0 scale-95'
        }`}
        style={{
          transformOrigin: 'right center',
          transitionProperty: 'transform, opacity, scale'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bot Icon in Header */}
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 28 28"
                  fill="none"
                  className="text-white"
                >
                  <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                  <circle cx="14" cy="14" r="8" fill="currentColor" fillOpacity="0.9" />
                  <path d="M10 14 L14 10 L18 14 L14 18 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="14" cy="14" r="2" fill="white" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">GennoorBot</h2>
                <p className="text-xs opacity-90">AI-Powered Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-sm'
                  : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200'
              } px-4 py-2.5`}>
                <p className="text-sm">{message.content}</p>

                {/* Assistant Actions */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Copy">
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'positive')}
                      className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                        message.feedback === 'positive' ? 'text-green-600' : 'text-gray-400'
                      }`}
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'negative')}
                      className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                        message.feedback === 'negative' ? 'text-red-600' : 'text-gray-400'
                      }`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about leads, research, or strategies..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-1 mt-2">
            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
              Research Company
            </button>
            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
              Find Contacts
            </button>
            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
              Draft Email
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}