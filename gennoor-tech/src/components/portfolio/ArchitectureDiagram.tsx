interface ArchitectureDiagramProps {
  diagram: string
  title?: string
}

export default function ArchitectureDiagram({ diagram, title }: ArchitectureDiagramProps) {
  return (
    <div className="my-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 overflow-x-auto border border-gray-700">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <pre className="text-xs sm:text-sm text-green-400 font-mono leading-relaxed whitespace-pre overflow-x-auto">
        {diagram}
      </pre>
    </div>
  )
}