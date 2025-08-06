"use client"

import type React from "react"

import { useRef, useEffect, useCallback, useState } from "react"
import { Rnd } from "react-rnd"
import type { TemplateElement, TemplateData } from "@/types/template"
import { cn } from "@/lib/utils"
import { TextFormatToolbar } from "@/components/text-format-toolbar"

interface TemplateEditorProps {
  elements: TemplateElement[]
  setElements: (elements: TemplateElement[]) => void
  selectedElement: string | null
  setSelectedElement: (id: string | null) => void
  templateData: TemplateData
  layoutName: string
  layoutSize: string
}

export function TemplateEditor({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  templateData,
  layoutName,
  layoutSize,
}: TemplateEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = useCallback(
    (id: string) => {
      setElements(elements.filter((el) => el.id !== id))
      if (selectedElement === id) {
        setSelectedElement(null)
        setEditingElementId(null)
      }
    },
    [elements, selectedElement, setElements, setSelectedElement],
  )

  // Handle keyboard events for delete functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedElement && !editingElementId) {
        event.preventDefault()
        deleteElement(selectedElement)
      }
      // ESC to deselect and exit editing
      if (event.key === "Escape") {
        setSelectedElement(null)
        setEditingElementId(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedElement, editingElementId, deleteElement, setSelectedElement])

  // Sync editing state with selected element
  useEffect(() => {
    if (selectedElement) {
      const el = elements.find((e) => e.id === selectedElement)
      if (el && el.type === "text") {
        // Only enter editing mode if it's a text element
        setEditingElementId(selectedElement)
      } else {
        setEditingElementId(null)
      }
    } else {
      setEditingElementId(null)
    }
  }, [selectedElement, elements])

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

    const isCurrentlyEditing = editingElementId === element.id

    const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
      const newContent = e.target.innerText
      updateElement(element.id, { content: newContent })
      setEditingElementId(null) // Exit editing mode on blur
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        e.preventDefault() // Prevent new line
        e.currentTarget.blur() // Trigger onBlur
      } else if (e.key === "Escape") {
        // Revert to original content if escape is pressed
        e.currentTarget.innerText = element.content
        e.currentTarget.blur() // Trigger onBlur
      }
    }

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

    if (isCurrentlyEditing) {
      return (
        <div
          contentEditable="true"
          suppressContentEditableWarning={true} // To suppress React warning
          onBlur={handleContentChange}
          onKeyDown={handleKeyDown}
          style={textStyles}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500"
          dangerouslySetInnerHTML={{ __html: element.content }} // Use dangerouslySetInnerHTML for initial content
        />
      )
    } else {
      // Display mode
      let content = element.content
      if (element.dataBinding && content.includes("{{")) {
        content = content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
          return `[${path.split(".").pop()}]`
        })
      }
      return <div style={textStyles}>{content}</div>
    }
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
  const scale = 0.8 // Scale down for editor (changed from 0.7 to match preview)

  return (
    <div className="flex-1 bg-gray-100 p-4 overflow-auto min-h-0">
      {/* Text Formatting Toolbar */}
      {selectedElement && elements.find((el) => el.id === selectedElement)?.type === "text" && (
        <div className="mb-4 flex justify-center">
          <TextFormatToolbar
            element={elements.find((el) => el.id === selectedElement)!}
            onUpdate={(updates) => updateElement(selectedElement, updates)}
          />
        </div>
      )}

      <div className="flex justify-center">
        <div className="relative">
          <div className="mb-2 text-xs text-gray-500 text-center">
            {layoutName} - Editor ({Math.round(canvasSize.width * scale)} x {Math.round(canvasSize.height * scale)}px)
          </div>
          <div
            ref={canvasRef}
            className="relative bg-white shadow-lg border focus:outline-none"
            style={{
              width: `${canvasSize.width * scale}px`,
              height: `${canvasSize.height * scale}px`,
            }}
            onClick={() => {
              setSelectedElement(null)
              setEditingElementId(null) // Clear editing state when clicking outside
            }}
            tabIndex={0}
          >
            {/* Instructions */}
            {selectedElement && (
              <div className="absolute -top-6 right-0 text-xs text-gray-500">
                Press Delete or Backspace to remove selected element
              </div>
            )}

            {elements.map((element) => (
              <Rnd
                key={element.id}
                size={{
                  width: element.size.width * scale,
                  height: element.size.height * scale,
                }}
                position={{
                  x: element.position.x * scale,
                  y: element.position.y * scale,
                }}
                onDragStart={() => {
                  setSelectedElement(element.id)
                  setEditingElementId(null) // Exit editing mode when dragging
                }}
                onDragStop={(e, d) => {
                  updateElement(element.id, {
                    position: { x: d.x / scale, y: d.y / scale },
                  })
                }}
                onResizeStart={() => {
                  setSelectedElement(element.id)
                  setEditingElementId(null) // Exit editing mode when resizing
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  updateElement(element.id, {
                    size: {
                      width: Number.parseInt(ref.style.width) / scale,
                      height: Number.parseInt(ref.style.height) / scale,
                    },
                    position: {
                      x: position.x / scale,
                      y: position.y / scale,
                    },
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
                  if (element.type === "text") {
                    setEditingElementId(element.id) // Enter editing mode for text elements
                  } else {
                    setEditingElementId(null) // Exit editing mode for non-text elements
                  }
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
                <div
                  className="w-full h-full relative"
                  style={{ transform: `scale(${1 / scale})`, transformOrigin: "top left" }}
                >
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

            {/* Editor watermark */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-400 opacity-50">EDITOR</div>
          </div>
        </div>
      </div>
    </div>
  )
}
