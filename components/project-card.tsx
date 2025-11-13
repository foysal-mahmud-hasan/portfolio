import { ExternalLink } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  link: string
}

export default function ProjectCard({ title, description, tags, link }: ProjectCardProps) {
  return (
    <div className="group border border-border rounded-sm bg-card/50 p-6 hover:bg-card hover:border-accent transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <ExternalLink
          className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0"
          size={20}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs border border-border rounded-sm bg-background/50 text-muted-foreground group-hover:border-accent group-hover:text-accent transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
