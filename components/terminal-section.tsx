import type { ReactNode } from "react"

interface TerminalSectionProps {
  title: string
  command: string
  children: ReactNode
}

export default function TerminalSection({ title, command, children }: TerminalSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="cli-text text-muted-foreground">
          <span className="cli-prompt">$</span> {command}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>

      <div className="border border-border rounded-sm bg-card/50 p-8 backdrop-blur-sm">{children}</div>
    </div>
  )
}
