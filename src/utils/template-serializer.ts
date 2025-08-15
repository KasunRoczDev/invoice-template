import type { TemplateElement, TemplateData } from "@/types/template"

export interface SaveTemplatePayload {
  id: string
  name: string
  size: string
  elements: TemplateElement[]
  templateData: TemplateData
  createdAt: string
  updatedAt: string
  version: string
  metadata: {
    totalElements: number
    textElements: number
    imageElements: number
    fieldElements: number
    canvasSize: string
    lastModified: string
    elementPositions: Array<{
      id: string
      type: string
      x: number
      y: number
      width: number
      height: number
    }>
  }
}

export function serializeTemplateForSave(
  layoutName: string,
  layoutSize: string,
  elements: TemplateElement[],
  templateData: TemplateData,
  isUpdate = false,
  existingId?: string,
): SaveTemplatePayload {
  const now = new Date().toISOString()

  return {
    id: existingId || `template-${Date.now()}`,
    name: layoutName,
    size: layoutSize,
    elements: elements.map((element) => ({
      ...element,
      content: element.content,
      styles: element.styles || {},
    })),
    templateData,
    createdAt: isUpdate ? (existingId ? now : now) : now,
    updatedAt: now,
    version: "1.0.0",
    metadata: {
      totalElements: elements.length,
      textElements: elements.filter((el) => el.type === "text").length,
      imageElements: elements.filter((el) => el.type === "image").length,
      fieldElements: elements.filter((el) => el.type === "field").length,
      canvasSize: layoutSize,
      lastModified: now,
      elementPositions: elements.map((el) => ({
        id: el.id,
        type: el.type,
        x: el.position.x,
        y: el.position.y,
        width: el.size.width,
        height: el.size.height,
      })),
    },
  }
}

export function logTemplateData(templateData: SaveTemplatePayload, action = "SAVE") {
  console.group(`=== ${action} TEMPLATE TO BACKEND ===`)
  console.log("📋 Template ID:", templateData.id)
  console.log("📝 Template Name:", templateData.name)
  console.log("📐 Layout Size:", templateData.size)
  console.log("🔢 Total Elements:", templateData.metadata.totalElements)
  console.log("📄 Text Elements:", templateData.metadata.textElements)
  console.log("🖼️ Image Elements:", templateData.metadata.imageElements)
  console.log("🏷️ Field Elements:", templateData.metadata.fieldElements)
  console.log("⏰ Last Modified:", templateData.metadata.lastModified)

  console.group("📊 Element Positions:")
  templateData.metadata.elementPositions.forEach((pos) => {
    console.log(`${pos.type} (${pos.id}): x=${pos.x}, y=${pos.y}, w=${pos.width}, h=${pos.height}`)
  })
  console.groupEnd()

  console.group("🗂️ Template Data:")
  console.log("Business Details:", templateData.templateData.businessDetails)
  console.log("Waybill Details:", templateData.templateData.waybillDetails)
  console.log("Sender Details:", templateData.templateData.senderDetails)
  console.log("Receiver Details:", templateData.templateData.receiverDetails)
  console.log("Order Details:", templateData.templateData.orderDetails)
  console.log("Product Details:", templateData.templateData.productDetails)
  console.groupEnd()

  console.group("🎨 Full Template JSON:")
  console.log(JSON.stringify(templateData, null, 2))
  console.groupEnd()

  console.groupEnd()
}

// Example backend API integration functions
export async function saveTemplateToBackend(templateData: SaveTemplatePayload): Promise<SaveTemplatePayload> {
  try {
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(templateData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const savedTemplate = await response.json()
    console.log("✅ Template saved successfully:", savedTemplate)
    return savedTemplate
  } catch (error) {
    console.error("❌ Error saving template:", error)
    throw error
  }
}

export async function updateTemplateInBackend(templateData: SaveTemplatePayload): Promise<SaveTemplatePayload> {
  try {
    const response = await fetch(`/api/templates/${templateData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(templateData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedTemplate = await response.json()
    console.log("✅ Template updated successfully:", updatedTemplate)
    return updatedTemplate
  } catch (error) {
    console.error("❌ Error updating template:", error)
    throw error
  }
}
