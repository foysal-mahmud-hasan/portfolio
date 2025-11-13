"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  whoami,
  about,
  skills,
  projects,
  contact,
  portfolioMd,
  resumePath,
} from "../lib/profile"

interface TerminalLine {
  type: "input" | "output" | "error" | "image"
  content: React.ReactNode
}

const commands: Record<string, (args?: string[]) => string | React.ReactNode> = {
  help: () => `Available commands:
  whoami          - Display owner information
  about           - Learn more about me
  skills          - List my technical skills
  projects        - View featured projects
  profile         - Show my profile image
  contact         - Get contact information
  resume          - Download My Resume
  clear           - Clear the terminal
  ls              - List available sections
  cat <file>      - Read file contents
  echo <text>     - Echo text
  pwd             - Print working directory
  date            - Show current date/time`,

  whoami: () => whoami,

  about: () => about,

  skills: () => skills,

  projects: () => projects,

  contact: () => contact,

  profile: () => "PROFILE_IMAGE",

  ls: () => `about/
projects/
skills/
contact/
profile.jpg
resume.pdf
portfolio.md`,

  pwd: () => `/home/portfolio`,

  date: () => new Date().toString(),

  resume: () => resumePath,

  clear: () => "",

  echo: (args?: string[]) => (args || []).join(" "),
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content: `Welcome to Portfolio CLI v1.0
Type 'help' to see available commands.`,
    },
  ])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Convert an image URL to colored ASCII art (returns a React node <pre>...</pre>)
  const imageToAscii = async (
    src: string,
    maxWidth = 80
  ): Promise<React.ReactNode> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          const aspect = img.height / img.width
          // Account for character aspect ratio (chars are taller than they are wide)
          const width = Math.min(maxWidth, img.width)
          const height = Math.max(2, Math.round(width * aspect * 0.5))

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          const data = ctx.getImageData(0, 0, width, height).data

          // Gradient from dark -> light (denser to lighter)
          const chars = '@%#*+=-:. '

          const rows: React.ReactNode[] = []
          for (let y = 0; y < height; y++) {
            const rowSpans: React.ReactNode[] = []
            for (let x = 0; x < width; x++) {
              const i = (y * width + x) * 4
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              // Perceptual luminance
              const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
              const idx = Math.floor(((lum / 255) * (chars.length - 1)))
              const ch = chars[chars.length - 1 - idx]
              const color = `rgb(${r}, ${g}, ${b})`
              // Use a non-breaking space for space to keep layout consistent
              const displayChar = ch === ' ' ? '\u00A0' : ch
              rowSpans.push(
                <span key={`${x}-${y}`} style={{ color }}>
                  {displayChar}
                </span>
              )
            }
            rows.push(
              <div key={`r-${y}`} style={{ lineHeight: '6px', fontSize: '6px' }}>
                {rowSpans}
              </div>
            )
          }

          // Wrap in pre for whitespace preservation
          resolve(<pre style={{ margin: 0 }}>{rows}</pre>)
        } catch (err) {
          reject(err)
        }
      }
      img.onerror = reject
      img.src = src
    })
  }

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    // Add input line
    setLines((prev) => [...prev, { type: "input", content: `$ ${trimmed}` }])

    // Parse command
    const parts = trimmed.split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Handle cat command specially
    if (command === 'cat') {
      const file = args[0]
      if (file === 'about.md') {
        setLines((prev) => [...prev, { type: 'output', content: commands.about() }])
      } else if (file === 'skills.txt') {
        setLines((prev) => [...prev, { type: 'output', content: commands.skills() }])
      } else if (file === 'projects.md') {
        setLines((prev) => [...prev, { type: 'output', content: commands.projects() }])
      } else if (file === 'contact.txt') {
        setLines((prev) => [...prev, { type: 'output', content: commands.contact() }])
      } else if (file === 'portfolio.md') {
        // print the portfolio markdown
        setLines((prev) => [...prev, { type: 'output', content: portfolioMd }])
      } else if (file === 'foysal-mahmud-hasan-resume.pdf') {
        // provide a download link for the resume
        const href = resumePath
        setLines((prev) => [
          ...prev,
          {
            type: 'output',
            content: (
              <div>
                <a href={href} download className="text-accent underline">
                  Download Resume
                </a>
              </div>
            ),
          },
        ])
        // Also trigger an automatic download in the browser
        if (typeof window !== 'undefined') {
          const a = document.createElement('a')
          a.href = href
          a.download = href.split('/').pop() || 'resume.pdf'
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
        }
      } else if (file === 'profile.jpg') {
        // convert image to ascii and push as output
        try {
          const ascii = await imageToAscii('/foysal-mahmud-hasan.jpg', 80)
          setLines((prev) => [...prev, { type: 'output', content: ascii }])
        } catch (err) {
          setLines((prev) => [...prev, { type: 'error', content: 'Failed to load profile image for ASCII conversion.' }])
        }
      } else {
        setLines((prev) => [
          ...prev,
          {
            type: 'error',
            content: `cat: ${file}: No such file or directory`,
          },
        ])
      }
    } else if (command === "clear") {
      setLines([])
    } else if (command === 'profile') {
      // Convert and print ascii art for profile
      try {
        const ascii = await imageToAscii('/foysal-mahmud-hasan.jpg', 80)
        setLines((prev) => [...prev, { type: 'output', content: ascii }])
      } catch (err) {
        setLines((prev) => [...prev, { type: 'error', content: 'Failed to load profile image for ASCII conversion.' }])
      }
    } else if (command === 'resume') {
      const href = resumePath
      setLines((prev) => [
        ...prev,
        {
          type: 'output',
          content: (
            <div>
              <a href={href} download className="text-accent underline">
                Download Resume
              </a>
            </div>
          ),
        },
      ])
      // Auto-trigger download
      if (typeof window !== 'undefined') {
        const a = document.createElement('a')
        a.href = href
        a.download = href.split('/').pop() || 'resume.pdf'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } else if (commands[command]) {
      const output = commands[command](args)
      if (output && output !== 'PROFILE_IMAGE') {
        setLines((prev) => [...prev, { type: 'output', content: output }])
      }
    } else {
      setLines((prev) => [...prev, { type: "error", content: `Command not found: ${command}` }])
    }

    // Update history
    setHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const newIndex = historyIndex + 1
      if (newIndex < history.length) {
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col">
      {/* Terminal Header */}
      <div className="border border-border rounded-t-lg bg-card/50 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">portfolio@cli ~ %</span>
      </div>

      <div
        ref={terminalRef}
        className="border border-t-0 border-border rounded-b-lg bg-background flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 scroll-smooth flex flex-col"
      >
        {lines.map((line, idx) => (
          <div key={idx}>
            {line.type === "image" ? (
              <div className="my-4 flex justify-center">
                <img
                  src="/foysal-mahmud-hasan.jpg"
                  alt="Profile"
                  className="w-48 h-48 rounded-lg border border-accent/50"
                />
              </div>
            ) : (
              <div
                className={`whitespace-pre-wrap wrap-break-word ${
                  line.type === "input" ? "text-accent" : line.type === "error" ? "text-red-400" : "text-foreground"
                }`}
              >
                {line.content}
              </div>
            )}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-start gap-2 pt-2 mt-auto">
          <span className="text-accent shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground caret-accent"
            spellCheck="false"
            autoComplete="off"
          />
          <span className="text-accent animate-pulse">▋</span>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Type <span className="text-accent font-mono">help</span> or{" "}
        <span className="text-accent font-mono">profile</span> to get started
      </div>
    </div>
  )
}
