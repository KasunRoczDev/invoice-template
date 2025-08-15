import type React from "react"
import { useRef, useEffect, useCallback, useState } from "react"
import { Rnd } from "react-rnd"
import type { TemplateElement, TemplateData } from "@/types/template"
import { cn } from "@/lib/utils"
import { TextFormatToolbar } from "@/components/text-format-toolbar"
// @ts-ignore
import logo from "../assets/Land Logo 2.png"

interface TemplateEditorProps {
  elements: TemplateElement[]
  setElements: (elements: TemplateElement[]) => void
  selectedElement: string | null
  setSelectedElement: (id: string | null) => void
  templateData: TemplateData
  layoutName: string
  layoutSize: string
  elementRotations: Record<string, number>
  rotateElement: (id: string, degrees: number) => void
  addElement: (type: TemplateElement["type"], dataBinding?: string, content?: string) => void
}

export function TemplateEditor({
                                 elements,
                                 setElements,
                                 selectedElement,
                                 setSelectedElement,
                                 layoutName,
                                 layoutSize,
                                 elementRotations,
                                 rotateElement,
                                 addElement,
                               }: TemplateEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [editingElementId, setEditingElementId] = useState<string | null>(null)
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
  const scale = 1 // Scale down for editor

  // Add the new "Powered by" element
  useEffect(() => {
    const newElements = [...elements];
    const poweredByTextIndex = newElements.findIndex(
        el => el.content === "Powered by" && el.type === "text"
    );
    const storemateLogoIndex = newElements.findIndex(
        el => el.content === logo && el.type === "image"
    );

    // Calculate new positions
    const poweredByTextPos = {
      x: (canvasSize.width - 180) / 2,
      y: canvasSize.height - 40,
    };
    const logoPos = {
      x: (canvasSize.width - 440) / 2 + 210,
      y: canvasSize.height - 40,
    };

    // Update if exists, else create
    if (poweredByTextIndex !== -1) {
      newElements[poweredByTextIndex] = {
        ...newElements[poweredByTextIndex],
        position: poweredByTextPos,
      };
    } else {
      newElements.push({
        id: `element-powered-by-text-${Date.now()}`,
        type: "text",
        content: "Powered by",
        position: poweredByTextPos,
        size: { width: 200, height: 30 },
        styles: {
          fontSize: "12px",
          fontWeight: "normal",
          textAlign: "left",
          color: "#000000",
        },
      });
    }

    if (storemateLogoIndex !== -1) {
      newElements[storemateLogoIndex] = {
        ...newElements[storemateLogoIndex],
        position: logoPos,
      };
    } else {
      newElements.push({
        id: `element-storemate-logo-${Date.now()}`,
        type: "image",
        content: logo,
        position: logoPos,
        size: { width: 100, height: 30 },
        styles: {},
      });
    }

    setElements(newElements);
  }, [canvasSize.width, canvasSize.height, layoutSize]);


  console.log({elements})

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    console.log(`Updating element ${id} with`, updates)
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

  // Default element for TextFormatToolbar when no text element is selected
  const defaultElement: TemplateElement = {
    id: "default",
    type: "text",
    content: "",
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    styles: {
      fontSize: "16px",
      fontWeight: "normal",
      textAlign: "left",
      color: "#000000",
    },
  }

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

    if (element.type === "horizontalRule") {
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
        >
          <div className="w-full h-[2px] bg-black"></div>
        </div>
      )
    }

    if (element.type === "verticalRule") {
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
        >
          <div className="h-full w-[2px] bg-black"></div>
        </div>
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



  return (
      <div className="flex-1 bg-white p-4 overflow-auto min-h-0">
        {/* Text Formatting Toolbar - Always Visible */}
        <div className="mb-4 flex justify-center">
          <TextFormatToolbar
              element={elements.find((el) => el.id === selectedElement && el.type === "text") || defaultElement}
              onUpdate={(updates) => {
                if (selectedElement && elements.find((el) => el.id === selectedElement)?.type === "text") {
                  updateElement(selectedElement, updates)
                }
              }}
              disabled={!selectedElement || elements.find((el) => el.id === selectedElement)?.type !== "text"}
              addElement={addElement}
          />
        </div>

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

              {elements.map((element) => {
                const isPoweredByElement = element.content === "Powered by" || element.content === logo
                return (
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
                          if (!isPoweredByElement) {
                            setSelectedElement(element.id)
                            setEditingElementId(null) // Exit editing mode when dragging
                          }
                        }}
                        onDragStop={(e, d) => {
                          if (!isPoweredByElement) {
                            console.log(`Dragging element ${element.id} to`, d)
                            // Final position update is already handled by onDrag
                            // This ensures any final adjustments are applied
                            updateElement(element.id, {
                              position: { x: d.x / scale, y: d.y / scale },
                            })
                          }
                        }}
                        onResizeStart={() => {
                          if (!isPoweredByElement) {
                            setSelectedElement(element.id)
                            setEditingElementId(null) // Exit editing mode when resizing
                          }
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                          if (!isPoweredByElement) {
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
                          }
                        }}
                        bounds="parent"
                        className={cn(
                            "border border-transparent hover:border-blue-300 transition-all duration-200",
                            selectedElement === element.id && "border-blue-500 border-2 shadow-lg",
                            isPoweredByElement && "cursor-default", // Remove cursor-move for powered by element
                        )}
                        style={{
                            transition: selectedElement === element.id ? 'none' : 'transform 0.1s ease-out'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedElement(element.id)
                          if (element.type === "text" && !isPoweredByElement) {
                            setEditingElementId(element.id) // Enter editing mode for text elements, except powered by
                          } else {
                            setEditingElementId(null) // Exit editing mode for non-text elements or powered by
                          }
                        }}
                        enableResizing={isPoweredByElement ? {
                          top: false,
                          right: false,
                          bottom: false,
                          left: false,
                          topRight: false,
                          bottomRight: false,
                          bottomLeft: false,
                          topLeft: false,
                        } : {
                          top: true,
                          right: true,
                          bottom: true,
                          left: true,
                          topRight: true,
                          bottomRight: true,
                          bottomLeft: true,
                          topLeft: true,
                        }}
                        disableDragging={isPoweredByElement}
                        resizeHandleStyles={isPoweredByElement ? {} : {
                          topRight: { cursor: "ne-resize" },
                          topLeft: { cursor: "nw-resize" },
                          bottomRight: { cursor: "se-resize" },
                          bottomLeft: { cursor: "sw-resize" },
                          top: { cursor: "n-resize" },
                          right: { cursor: "e-resize" },
                          bottom: { cursor: "s-resize" },
                          left: { cursor: "w-resize" },
                        }}
                        dragAxis="both"
                        dragGrid={[1, 1]} // Pixel-level precision for smooth dragging
                        enableUserSelectHack={false} // Prevents text selection during drag
                        onDrag={(e, d) => {
                          if (!isPoweredByElement) {
                            // Update position during drag for smoother movement
                            const updatedElements = elements.map(el => 
                              el.id === element.id 
                                ? { ...el, position: { x: d.x / scale, y: d.y / scale } }
                                : el
                            );
                            setElements(updatedElements);
                          }
                        }}
                    >
                      <div
                          className="w-full h-full relative"
                          style={{ 
                            transform: `scale(${1 / scale}) rotate(${elementRotations[element.id] || 0}deg)`, 
                            transformOrigin: "center center",
                            transition: selectedElement === element.id ? 'none' : 'transform 0.15s ease-out'
                          }}
                      >
                        {renderElementContent(element)}
                        {selectedElement === element.id && !isPoweredByElement && (
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

                              {/* Rotation controls */}
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    rotateElement(element.id, -15)
                                  }}
                                  className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 shadow-md"
                                  title="Rotate counter-clockwise"
                                >
                                  ↺
                                </button>
                                <span className="text-xs bg-white px-1 rounded shadow">
                                  {elementRotations[element.id] || 0}°
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    rotateElement(element.id, 15)
                                  }}
                                  className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 shadow-md"
                                  title="Rotate clockwise"
                                >
                                  ↻
                                </button>
                              </div>
                            </>
                        )}
                      </div>
                    </Rnd>
                )
              })}

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
