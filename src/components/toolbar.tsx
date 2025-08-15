// @ts-ignore
import oms from "../assets/Land Logo 2.png"
import { Button } from "@/components/ui/button"

interface ToolbarProps {
  addElement: (type: string) => void
}

export function Toolbar({ addElement }: ToolbarProps) {
  return (
      <div className="h-20 flex items-center justify-between px-6">
        <img
            src={oms}
            alt="Oms Logo"
            className="w-40"
        />
        <div className="flex items-center gap-4">
          {/* Line element button moved to text-format-toolbar */}
        </div>
      </div>
  )
}
