import type { TemplateElement, TemplateData } from "@/types/template"

interface TemplatePreviewProps {
  elements: TemplateElement[]
  templateData: TemplateData
  layoutName: string
  layoutSize: string
}

export function TemplatePreview({ elements, templateData, layoutName, layoutSize }: TemplatePreviewProps) {
  const renderElementContent = (element: TemplateElement) => {
    if (element.type === "image") {
      return element.content ? (
        <img
          src={element.content || "/placeholder.svg"}
          alt="Template element"
          className="w-full h-full object-contain"
          crossOrigin="anonymous"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">Image</div>
      )
    }

    let content = element.content
    if (element.dataBinding && content.includes("{{")) {
      const keys = element.dataBinding.split(".")
      let value: any = templateData
      for (const key of keys) {
        value = value?.[key]
      }
      content = content.replace(/\{\{.*?\}\}/g, value || element.content)
    }

    // Handle multiple template variables in one content string
    content = content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.trim().split(".")
      let value: any = templateData
      for (const key of keys) {
        value = value?.[key]
      }
      return value || match
    })

    const textStyles = {
      ...element.styles,
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "100%",
      padding: element.styles?.padding || "0 8px",
      wordWrap: "break-word" as const,
      overflow: "hidden",
      justifyContent:
        element.styles?.textAlign === "center"
          ? "center"
          : element.styles?.textAlign === "right"
            ? "flex-end"
            : "flex-start",
    }

    return <div style={textStyles}>{content}</div>
  }

  const getCanvasSize = () => {
    switch (layoutSize) {
      case "A3":
        return { width: 1123, height: 1587 }
      case "A4":
        return { width: 794, height: 1123 }
      case "A5":
        return { width: 559, height: 794 }
      default:
        return { width: 794, height: 1123 }
    }
  }

  const canvasSize = getCanvasSize()
  const scale = 0.8 // Scale down for preview

  return (
    <div className="flex-1 p-4 overflow-auto flex justify-center items-start min-h-0">
      <div className="relative">
        <div className="mb-2 text-xs text-gray-500 text-center">
          {layoutName} - Preview ({Math.round(canvasSize.width * scale)} x {Math.round(canvasSize.height * scale)}px)
        </div>
        <div
          className="relative bg-white shadow-lg border"
          style={{
            width: `${canvasSize.width * scale}px`,
            height: `${canvasSize.height * scale}px`,
          }}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
              }}
            >
              {renderElementContent(element)}
            </div>
          ))}

          {/* Preview watermark */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-400 opacity-50">PREVIEW</div>
        </div>
      </div>
    </div>
  )
}
