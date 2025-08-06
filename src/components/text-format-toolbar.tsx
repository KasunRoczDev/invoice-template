import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Type } from "lucide-react"
import type { TemplateElement } from "@/types/template"
import { cn } from "@/lib/utils"

interface TextFormatToolbarProps {
  element: TemplateElement
  onUpdate: (updates: Partial<TemplateElement>) => void
}

const fontSizes = [
  "8px",
  "9px",
  "10px",
  "11px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
  "60px",
  "72px",
]

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
  "Courier New",
]

const colors = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#FFA500",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
  "#000000",
  "#FFFFFF",
]

export function TextFormatToolbar({ element, onUpdate }: TextFormatToolbarProps) {
  const styles = element.styles || {}

  const updateStyle = (key: string, value: string) => {
    onUpdate({
      styles: {
        ...styles,
        [key]: value,
      },
    })
  }

  const toggleStyle = (key: string, value: string, defaultValue = "normal") => {
    const currentValue = styles[key] || defaultValue
    updateStyle(key, currentValue === value ? defaultValue : value)
  }

  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 flex items-center gap-2 max-w-4xl">
      {/* Font Family */}
      <div className="flex items-center gap-1">
        <Type size={16} className="text-gray-500" />
        <Select value={styles.fontFamily || "Arial"} onValueChange={(value) => updateStyle("fontFamily", value)}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
      <div className="flex items-center gap-1">
        <Select value={styles.fontSize || "14px"} onValueChange={(value) => updateStyle("fontSize", value)}>
          <SelectTrigger className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min="8"
          max="200"
          value={Number.parseInt(styles.fontSize || "14px")}
          onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
          className="w-16 h-8"
        />
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Style Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            (styles.fontWeight === "bold" || styles.fontWeight === "700") && "bg-blue-100 text-blue-600",
          )}
          onClick={() => toggleStyle("fontWeight", "bold", "normal")}
        >
          <Bold size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", styles.fontStyle === "italic" && "bg-blue-100 text-blue-600")}
          onClick={() => toggleStyle("fontStyle", "italic", "normal")}
        >
          <Italic size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", styles.textDecoration === "underline" && "bg-blue-100 text-blue-600")}
          onClick={() => toggleStyle("textDecoration", "underline", "none")}
        >
          <Underline size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            (styles.textAlign === "left" || !styles.textAlign) && "bg-blue-100 text-blue-600",
          )}
          onClick={() => updateStyle("textAlign", "left")}
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", styles.textAlign === "center" && "bg-blue-100 text-blue-600")}
          onClick={() => updateStyle("textAlign", "center")}
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", styles.textAlign === "right" && "bg-blue-100 text-blue-600")}
          onClick={() => updateStyle("textAlign", "right")}
        >
          <AlignRight size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <div className="flex flex-col items-center">
              <Palette size={14} />
              <div className="w-4 h-1 mt-0.5 border" style={{ backgroundColor: styles.color || "#000000" }} />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded border-2 hover:scale-110 transition-transform",
                  styles.color === color ? "border-blue-500" : "border-gray-300",
                )}
                style={{ backgroundColor: color }}
                onClick={() => updateStyle("color", color)}
                title={color}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              type="color"
              value={styles.color || "#000000"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="w-12 h-8 p-0 border-0"
            />
            <Input
              type="text"
              value={styles.color || "#000000"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="flex-1 h-8"
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6" />

      {/* Background Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Background Color">
            <div className="flex flex-col items-center">
              <div
                className="w-4 h-3 border rounded-sm"
                style={{ backgroundColor: styles.backgroundColor || "transparent" }}
              />
              <div className="text-xs">BG</div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="grid grid-cols-6 gap-2">
            <button
              className={cn(
                "w-8 h-8 rounded border-2 hover:scale-110 transition-transform bg-white",
                !styles.backgroundColor && "border-blue-500",
              )}
              onClick={() => updateStyle("backgroundColor", "transparent")}
              title="Transparent"
            >
              <div className="w-full h-full bg-gradient-to-br from-red-500 via-transparent to-red-500 opacity-30" />
            </button>
            {colors.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded border-2 hover:scale-110 transition-transform",
                  styles.backgroundColor === color ? "border-blue-500" : "border-gray-300",
                )}
                style={{ backgroundColor: color }}
                onClick={() => updateStyle("backgroundColor", color)}
                title={color}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Input
              type="color"
              value={styles.backgroundColor || "#ffffff"}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-12 h-8 p-0 border-0"
            />
            <Input
              type="text"
              value={styles.backgroundColor || ""}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="flex-1 h-8"
              placeholder="transparent"
            />
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6" />

      {/* Line Height */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">LH:</span>
        <Input
          type="number"
          min="0.5"
          max="3"
          step="0.1"
          value={Number.parseFloat(styles.lineHeight || "1.2")}
          onChange={(e) => updateStyle("lineHeight", e.target.value)}
          className="w-16 h-8"
        />
      </div>

      {/* Letter Spacing */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">LS:</span>
        <Input
          type="number"
          min="-5"
          max="10"
          step="0.1"
          value={Number.parseFloat(styles.letterSpacing || "0")}
          onChange={(e) => updateStyle("letterSpacing", `${e.target.value}px`)}
          className="w-16 h-8"
        />
      </div>
    </div>
  )
}
