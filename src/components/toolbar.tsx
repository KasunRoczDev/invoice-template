import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
} from "lucide-react"

export function Toolbar() {
  return (
    <div className="bg-white border-b px-4 py-2 flex items-center gap-2">
      {/* File operations */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-2">
          📄
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          💾
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          📋
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text formatting */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Bold size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Italic size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Underline size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Heading styles */}
      <Select defaultValue="normal">
        <SelectTrigger className="w-24 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignLeft size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignCenter size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignRight size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <AlignJustify size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <List size={14} />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ListOrdered size={14} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Additional tools */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          🔗
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          📷
        </Button>
      </div>
    </div>
  )
}
