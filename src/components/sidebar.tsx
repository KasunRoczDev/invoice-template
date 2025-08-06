import type { TemplateElement, TemplateData } from "@/types/template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { serializeTemplateForSave, logTemplateData } from "@/utils/template-serializer"

interface SidebarProps {
  elements: TemplateElement[]
  setElements: (elements: TemplateElement[]) => void
  selectedElement: string | null
  templateData: TemplateData
  setTemplateData: (data: TemplateData) => void
  layoutName: string
  setLayoutName: (name: string) => void
  layoutSize: string
  setLayoutSize: (size: string) => void
  setSelectedElement: (id: string | null) => void
}

export function Sidebar({
  elements,
  setElements,
  selectedElement,
  templateData,
  setTemplateData,
  layoutName,
  setLayoutName,
  layoutSize,
  setLayoutSize,
  setSelectedElement,
}: SidebarProps) {
  const updateTemplateData = (section: keyof TemplateData, field: string, value: string | number) => {
    setTemplateData({
      ...templateData,
      [section]: {
        ...templateData[section],
        [field]: value,
      },
    })
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

  const saveTemplate = async (isDefault: boolean) => {
    const serializedData = serializeTemplateForSave(layoutName, layoutSize, elements, templateData, false)

    logTemplateData(serializedData, isDefault ? "SAVE AS DEFAULT" : "SAVE")

    alert(
      `Template "${serializedData.name}" ${isDefault ? "marked as default" : "saved"} successfully!\nCheck console for full data.`,
    )
  }

  return (
    <div className="w-72 bg-white border-l overflow-y-auto flex-shrink-0">
      <div className="p-4 space-y-4">
        {/* Layout Configuration */}
        <Card>
          <CardContent className="p-3 space-y-3">
            <div>
              <Label className="text-sm font-medium text-blue-600">Layout Name</Label>
              <Input
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="mt-1"
                placeholder="Default Project"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Layout Size</Label>
              <div className="flex gap-2 mt-1">
                {["A3", "A4", "A5"].map((size) => (
                  <Button
                    key={size}
                    variant={layoutSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayoutSize(size)}
                    className={layoutSize === size ? "bg-blue-600" : ""}
                  >
                    {size}
                  </Button>
                ))}
                <Button
                  variant={layoutSize === "Custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayoutSize("Custom")}
                  className={layoutSize === "Custom" ? "bg-blue-600" : ""}
                >
                  Custom
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📷
              </Badge>
              <button
                onClick={() => addElement("image", "businessDetails.logo")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Logo
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                🏢
              </Badge>
              <button
                onClick={() =>
                  addElement("text", "businessDetails.businessLocationName", "{{businessDetails.businessLocationName}}")
                }
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Business Location Name
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📍
              </Badge>
              <button
                onClick={() =>
                  addElement("text", "businessDetails.locationAddressCity", "{{businessDetails.locationAddressCity}}")
                }
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Location Address & City
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📞
              </Badge>
              <button
                onClick={() => addElement("text", "businessDetails.contactNumber", "{{businessDetails.contactNumber}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Contact Number
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Waybill Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Waybill Details</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                #
              </Badge>
              <button
                onClick={() => addElement("text", "waybillDetails.waybillNumber", "{{waybillDetails.waybillNumber}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Waybill Number
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📊
              </Badge>
              <button
                onClick={() => addElement("text", "waybillDetails.waybillBarcode", "{{waybillDetails.waybillBarcode}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Waybill Barcode
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Sender Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Sender Details</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                👤
              </Badge>
              <button
                onClick={() => addElement("text", "senderDetails.customerName", "{{senderDetails.customerName}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Customer Name
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📍
              </Badge>
              <button
                onClick={() => addElement("text", "senderDetails.address", "{{senderDetails.address}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Address
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                🏙️
              </Badge>
              <button
                onClick={() => addElement("text", "senderDetails.city", "{{senderDetails.city}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                City
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📞
              </Badge>
              <button
                onClick={() => addElement("text", "senderDetails.contactNumber", "{{senderDetails.contactNumber}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Contact Number
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Receiver Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Receiver Details</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                👤
              </Badge>
              <button
                onClick={() => addElement("text", "receiverDetails.customerName", "{{receiverDetails.customerName}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Customer Name
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📍
              </Badge>
              <button
                onClick={() => addElement("text", "receiverDetails.address", "{{receiverDetails.address}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Address
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                🏙️
              </Badge>
              <button
                onClick={() => addElement("text", "receiverDetails.city", "{{receiverDetails.city}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                City
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📞
              </Badge>
              <button
                onClick={() => addElement("text", "receiverDetails.contactNumber", "{{receiverDetails.contactNumber}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Contact Number
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                #
              </Badge>
              <button
                onClick={() => addElement("text", "orderDetails.orderNumber", "{{orderDetails.orderNumber}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Order Number
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📊
              </Badge>
              <button
                onClick={() => addElement("text", "orderDetails.barcode", "{{orderDetails.barcode}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Barcode
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📅
              </Badge>
              <button
                onClick={() => addElement("text", "orderDetails.orderDate", "{{orderDetails.orderDate}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Order Date
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                💰
              </Badge>
              <button
                onClick={() => addElement("text", "orderDetails.totalCODAmount", "${{orderDetails.totalCODAmount}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Total COD Amount
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                #
              </Badge>
              <button
                onClick={() => addElement("text", "productDetails.sku", "{{productDetails.sku}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                SKU
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📦
              </Badge>
              <button
                onClick={() => addElement("text", "productDetails.productName", "{{productDetails.productName}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Product Name
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                🔢
              </Badge>
              <button
                onClick={() => addElement("text", "productDetails.quantity", "{{productDetails.quantity}}")}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Quantity
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📊
              </Badge>
              <button
                onClick={() =>
                  addElement("text", "productDetails.totalItemsInCount", "{{productDetails.totalItemsInCount}}")
                }
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Total Items in Count
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                📈
              </Badge>
              <button
                onClick={() =>
                  addElement("text", "productDetails.totalQuantityInCount", "{{productDetails.totalQuantityInCount}}")
                }
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
              >
                Total Quantity in Count
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => {
              if (confirm("Are you sure you want to clear all elements?")) {
                setElements([])
                setSelectedElement(null)
                console.log("🗑️ Template cleared")
              }
            }}
          >
            Clear
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // Fast Edit functionality - could open a modal or quick edit panel
              console.log("⚡ Fast Edit clicked - implement quick edit functionality")
            }}
          >
            Fast Edit
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => saveTemplate(true)}>
            Save as Default
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => saveTemplate(false)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
