'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'This is test' },
    { role: 'user', content: 'This is test 2' },
    { role: 'assistant', content: 'This is test 3' },
    { role: 'user', content: 'This is test 4' },
    { role: 'assistant', content: 'This is test 5' },
    { role: 'user', content: 'This is test 6' },
    { role: 'assistant', content: 'This is test 7' },
    { role: 'user', content: 'This is test 8' },
    { role: 'assistant', content: 'This is test 9' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatHistoryRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    const userMessage: Message = { role: 'user', content: prompt }
    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch response')
      }

      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setError(null)
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }, [messages, loading])

  return (
    <div className="container">
      <h1>AI Chat App</h1>
      
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>

      {messages.length > 0 && (
        <button onClick={handleClear} className="clear-button">
          Clear History
        </button>
      )}

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Loading response...</div>}

      {messages.length > 0 ? (
        <div className="chat-history" ref={chatHistoryRef}>
          {messages.map((message, index) => (
            <div key={index} className="message">
              <div className="message-label">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className={`message-content ${message.role}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <div className="empty-state">No messages yet. Start a conversation!</div>
      )}
    </div>
  )
}

