"use client"

import { useRef, useEffect, useCallback } from "react"
import { Rnd } from "react-rnd"
import type { TemplateElement, TemplateData } from "@/types/template"
import { cn } from "@/lib/utils"
import { TextFormatToolbar } from "@/components/text-format-toolbar"

interface TemplateBuilderProps {
  elements: TemplateElement[]
  setElements: (elements: TemplateElement[]) => void
  selectedElement: string | null
  setSelectedElement: (id: string | null) => void
  templateData: TemplateData
  layoutName: string
  layoutSize: string
}

export function TemplateBuilder({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  templateData,
  layoutName,
  layoutSize,
}: TemplateBuilderProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = useCallback(
    (id: string) => {
      setElements(elements.filter((el) => el.id !== id))
      if (selectedElement === id) {
        setSelectedElement(null)
      }
    },
    [elements, selectedElement, setElements, setSelectedElement],
  )

  // Handle keyboard events for delete functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedElement) {
        event.preventDefault()
        deleteElement(selectedElement)
      }
      // ESC to deselect
      if (event.key === "Escape") {
        setSelectedElement(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedElement, deleteElement, setSelectedElement])

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

    const textStyles = {
      ...element.styles,
      display: "flex",
      alignItems: "center",
      width: "100%",
      height: "100%",
      padding: "0 8px",
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
  const scale = 0.8 // Changed from 0.7 to match preview and editor

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-auto">
      <div className="flex justify-center">
        {/* Text Formatting Toolbar */}
        {selectedElement && elements.find((el) => el.id === selectedElement)?.type === "text" && (
          <div className="mb-4 flex justify-center">
            <TextFormatToolbar
              element={elements.find((el) => el.id === selectedElement)!}
              onUpdate={(updates) => updateElement(selectedElement, updates)}
            />
          </div>
        )}
        <div
          ref={canvasRef}
          className="relative bg-white shadow-lg border focus:outline-none"
          style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
          onClick={() => setSelectedElement(null)}
          tabIndex={0}
        >
          {/* Canvas header info */}
          <div className="absolute -top-6 left-0 text-xs text-gray-500">
            {layoutName} - {canvasSize.width} x {canvasSize.height}px
          </div>

          {/* Instructions */}
          {selectedElement && (
            <div className="absolute -top-6 right-0 text-xs text-gray-500">
              Press Delete or Backspace to remove selected element
            </div>
          )}

          {elements.map((element) => (
            <Rnd
              key={element.id}
              size={element.size}
              position={element.position}
              onDragStart={() => {
                setSelectedElement(element.id)
              }}
              onDragStop={(e, d) => {
                updateElement(element.id, { position: { x: d.x, y: d.y } })
              }}
              onResizeStart={() => {
                setSelectedElement(element.id)
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateElement(element.id, {
                  size: {
                    width: Number.parseInt(ref.style.width),
                    height: Number.parseInt(ref.style.height),
                  },
                  position,
                })
              }}
              bounds="parent"
              className={cn(
                "border border-transparent hover:border-blue-300 cursor-move transition-all duration-200",
                selectedElement === element.id && "border-blue-500 border-2 shadow-lg",
              )}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element.id)
              }}
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
              resizeHandleStyles={{
                topRight: { cursor: "ne-resize" },
                topLeft: { cursor: "nw-resize" },
                bottomRight: { cursor: "se-resize" },
                bottomLeft: { cursor: "sw-resize" },
                top: { cursor: "n-resize" },
                right: { cursor: "e-resize" },
                bottom: { cursor: "s-resize" },
                left: { cursor: "w-resize" },
              }}
            >
              <div className="w-full h-full relative">
                {renderElementContent(element)}
                {selectedElement === element.id && (
                  <>
                    {/* Selection indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteElement(element.id)
                      }}
                      className="absolute -top-8 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 shadow-md"
                      title="Delete element (or press Delete key)"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </Rnd>
          ))}

          {/* Empty state message */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-lg mb-2">📄</div>
                <div className="text-sm">Click on fields in the sidebar to add them to your template</div>
                <div className="text-xs mt-1">Drag and drop to position elements</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
