"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="cli-text text-muted-foreground">
          <span className="cli-prompt">{">"}</span> name
        </label>
        <input
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-border rounded-sm text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="cli-text text-muted-foreground">
          <span className="cli-prompt">{">"}</span> email
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-border rounded-sm text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="cli-text text-muted-foreground">
          <span className="cli-prompt">{">"}</span> message
        </label>
        <textarea
          placeholder="Your message..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 bg-background border border-border rounded-sm text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-sm hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-mono text-sm flex items-center justify-center gap-2"
      >
        <Send size={16} />
        {submitted ? "Message sent!" : "Send message"}
      </button>
    </form>
  )
}
