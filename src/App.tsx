import { useState } from "react"
import { TemplatePreview } from "@/components/template-preview"
import { TemplateEditor } from "@/components/template-editor"
import { Sidebar } from "@/components/sidebar"
import { Toolbar } from "@/components/toolbar"
import type { TemplateElement, TemplateData } from "@/types/template"

const initialData: TemplateData = {
  businessDetails: {
    logo: "/storemate-logo.png",
    businessLocationName: "StoreMate Main Branch",
    locationAddressCity: "123 Business Street, New York, NY 10001",
    contactNumber: "+1 (555) 123-4567",
  },
  waybillDetails: {
    waybillNumber: "WB2024001234",
    waybillBarcode: "1234567890123",
  },
  senderDetails: {
    customerName: "John Doe",
    address: "456 Sender Avenue",
    city: "New York",
    contactNumber: "+1 (555) 987-6543",
  },
  receiverDetails: {
    customerName: "Jane Smith",
    address: "789 Receiver Boulevard",
    city: "Los Angeles",
    contactNumber: "+1 (555) 456-7890",
  },
  orderDetails: {
    orderNumber: "ORD2024001",
    barcode: "9876543210987",
    orderDate: "2024-01-15",
    totalCODAmount: "299.99",
  },
  productDetails: {
    sku: "SKU-001-XYZ",
    productName: "Premium Wireless Headphones",
    quantity: 2,
    totalItemsInCount: 5,
    totalQuantityInCount: 10,
  },
}

const initialElements: TemplateElement[] = [
  {
    id: "logo",
    type: "image",
    content: "/storemate-logo.png",
    position: { x: 50, y: 30 },
    size: { width: 200, height: 60 },
    dataBinding: "businessDetails.logo",
    styles: {},
  },
  {
    id: "business-name",
    type: "text",
    content: "{{businessDetails.businessLocationName}}",
    position: { x: 50, y: 110 },
    size: { width: 350, height: 35 },
    dataBinding: "businessDetails.businessLocationName",
    styles: { fontSize: "20px", fontWeight: "bold", color: "#2563eb" },
  },
  {
    id: "business-address",
    type: "text",
    content: "{{businessDetails.locationAddressCity}}",
    position: { x: 50, y: 150 },
    size: { width: 350, height: 45 },
    dataBinding: "businessDetails.locationAddressCity",
    styles: { fontSize: "14px", color: "#666666", lineHeight: "1.4" },
  },
  {
    id: "business-contact",
    type: "text",
    content: "Contact: {{businessDetails.contactNumber}}",
    position: { x: 50, y: 200 },
    size: { width: 250, height: 25 },
    dataBinding: "businessDetails.contactNumber",
    styles: { fontSize: "12px", color: "#666666" },
  },
  {
    id: "waybill-title",
    type: "text",
    content: "WAYBILL",
    position: { x: 250, y: 250 },
    size: { width: 300, height: 50 },
    dataBinding: "",
    styles: {
      fontSize: "32px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#1f2937",
      backgroundColor: "#f3f4f6",
      padding: "10px",
    },
  },
  {
    id: "waybill-number",
    type: "text",
    content: "Waybill Number: {{waybillDetails.waybillNumber}}",
    position: { x: 50, y: 320 },
    size: { width: 300, height: 30 },
    dataBinding: "waybillDetails.waybillNumber",
    styles: { fontSize: "16px", fontWeight: "bold" },
  },
  {
    id: "waybill-barcode",
    type: "text",
    content: "Barcode: {{waybillDetails.waybillBarcode}}",
    position: { x: 400, y: 320 },
    size: { width: 250, height: 30 },
    dataBinding: "waybillDetails.waybillBarcode",
    styles: { fontSize: "14px", fontFamily: "Courier New" },
  },
  {
    id: "sender-section",
    type: "text",
    content: "SENDER DETAILS",
    position: { x: 50, y: 380 },
    size: { width: 200, height: 30 },
    dataBinding: "",
    styles: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#2563eb",
      padding: "8px",
      textAlign: "center",
    },
  },
  {
    id: "sender-name",
    type: "text",
    content: "{{senderDetails.customerName}}",
    position: { x: 50, y: 420 },
    size: { width: 200, height: 25 },
    dataBinding: "senderDetails.customerName",
    styles: { fontSize: "14px", fontWeight: "bold" },
  },
  {
    id: "sender-address",
    type: "text",
    content: "{{senderDetails.address}}, {{senderDetails.city}}",
    position: { x: 50, y: 450 },
    size: { width: 200, height: 50 },
    dataBinding: "senderDetails.address",
    styles: { fontSize: "12px", color: "#666666", lineHeight: "1.3" },
  },
  {
    id: "sender-contact",
    type: "text",
    content: "Phone: {{senderDetails.contactNumber}}",
    position: { x: 50, y: 510 },
    size: { width: 200, height: 25 },
    dataBinding: "senderDetails.contactNumber",
    styles: { fontSize: "12px", color: "#666666" },
  },
  {
    id: "receiver-section",
    type: "text",
    content: "RECEIVER DETAILS",
    position: { x: 400, y: 380 },
    size: { width: 200, height: 30 },
    dataBinding: "",
    styles: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#ffffff",
      backgroundColor: "#dc2626",
      padding: "8px",
      textAlign: "center",
    },
  },
  {
    id: "receiver-name",
    type: "text",
    content: "{{receiverDetails.customerName}}",
    position: { x: 400, y: 420 },
    size: { width: 200, height: 25 },
    dataBinding: "receiverDetails.customerName",
    styles: { fontSize: "14px", fontWeight: "bold" },
  },
  {
    id: "receiver-address",
    type: "text",
    content: "{{receiverDetails.address}}, {{receiverDetails.city}}",
    position: { x: 400, y: 450 },
    size: { width: 200, height: 50 },
    dataBinding: "receiverDetails.address",
    styles: { fontSize: "12px", color: "#666666", lineHeight: "1.3" },
  },
  {
    id: "receiver-contact",
    type: "text",
    content: "Phone: {{receiverDetails.contactNumber}}",
    position: { x: 400, y: 510 },
    size: { width: 200, height: 25 },
    dataBinding: "receiverDetails.contactNumber",
    styles: { fontSize: "12px", color: "#666666" },
  },
  {
    id: "order-details-section",
    type: "text",
    content: "ORDER INFORMATION",
    position: { x: 50, y: 570 },
    size: { width: 550, height: 30 },
    dataBinding: "",
    styles: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#1f2937",
      backgroundColor: "#f9fafb",
      padding: "8px",
      textAlign: "center",
      border: "1px solid #e5e7eb",
    },
  },
  {
    id: "order-number",
    type: "text",
    content: "Order #: {{orderDetails.orderNumber}}",
    position: { x: 50, y: 610 },
    size: { width: 180, height: 25 },
    dataBinding: "orderDetails.orderNumber",
    styles: { fontSize: "12px", fontWeight: "bold" },
  },
  {
    id: "order-date",
    type: "text",
    content: "Date: {{orderDetails.orderDate}}",
    position: { x: 240, y: 610 },
    size: { width: 150, height: 25 },
    dataBinding: "orderDetails.orderDate",
    styles: { fontSize: "12px" },
  },
  {
    id: "cod-amount",
    type: "text",
    content: "COD Amount: ${{orderDetails.totalCODAmount}}",
    position: { x: 400, y: 610 },
    size: { width: 200, height: 25 },
    dataBinding: "orderDetails.totalCODAmount",
    styles: { fontSize: "12px", fontWeight: "bold", color: "#dc2626" },
  },
  {
    id: "product-info",
    type: "text",
    content: "Product: {{productDetails.productName}} (SKU: {{productDetails.sku}})",
    position: { x: 50, y: 650 },
    size: { width: 400, height: 25 },
    dataBinding: "productDetails.productName",
    styles: { fontSize: "12px" },
  },
  {
    id: "quantity-info",
    type: "text",
    content: "Quantity: {{productDetails.quantity}} | Total Items: {{productDetails.totalItemsInCount}}",
    position: { x: 50, y: 680 },
    size: { width: 350, height: 25 },
    dataBinding: "productDetails.quantity",
    styles: { fontSize: "12px", color: "#666666" },
  },
]

function App() {
  const [elements, setElements] = useState<TemplateElement[]>(initialElements)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [templateData, setTemplateData] = useState<TemplateData>(initialData)
  const [layoutName, setLayoutName] = useState("Waybill Layout")
  const [layoutSize, setLayoutSize] = useState("A4")
  const [elementRotations, setElementRotations] = useState<Record<string, number>>({})

  const rotateElement = (id: string, degrees: number) => {
    setElementRotations(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + degrees
    }))
  }

  const addElement = (type: TemplateElement["type"], dataBinding?: string, content?: string) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type,
      content: content || (type === "text" ? "New Text" : type === "image" ? "" : "{{field}}"),
      position: { x: 100 + elements.length * 20, y: 200 + elements.length * 20 }, // Offset new elements
      size: { width: type === "image" ? 150 : 200, height: type === "image" ? 100 : 30 },
      dataBinding: dataBinding || "",
      styles: type === "text" ? { fontSize: "14px" } : {},
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id) // Auto-select new element
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <Toolbar addElement={addElement} />
        <hr/>
        <div className="flex-1 flex min-h-0">
          {/* Left Side - Preview */}
          <div className="flex-1 bg-white min-w-0">
            <div className="p-4  bg-white">
              <div className='bg-[#F5F8FB] p-4 flex justify-center items-center rounded-lg'>
              <p className="text-[20px] font-bold text-[#0094FF]">Preview</p>
              </div>
            </div>
            <TemplatePreview
              elements={elements}
              templateData={templateData}
              layoutName={layoutName}
              layoutSize={layoutSize}
              elementRotations={elementRotations}
            />
          </div>

          {/* Right Side - Editor */}
          <div className="flex-1 bg-white  min-w-0">
            <div className="p-4  bg-white">
              <div className='bg-[#F5F8FB] p-4 flex justify-center items-center rounded-l-lg'>
                <p className="text-[20px]  text-[#004385] font-bold">Layout </p>
              </div>
            </div>
            <TemplateEditor
              elements={elements}
              setElements={setElements}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              templateData={templateData}
              layoutName={layoutName}
              layoutSize={layoutSize}
              elementRotations={elementRotations}
              rotateElement={rotateElement}
              addElement={addElement}
            />
          </div>

          {/* Sidebar */}
          <Sidebar
            elements={elements}
            setElements={setElements}
            selectedElement={selectedElement}
            templateData={templateData}
            setTemplateData={setTemplateData}
            layoutName={layoutName}
            setLayoutName={setLayoutName}
            layoutSize={layoutSize}
            setLayoutSize={setLayoutSize}
            setSelectedElement={setSelectedElement}
            addElement={addElement}
          />
        </div>
      </div>
    </div>
  )
}

export default App
