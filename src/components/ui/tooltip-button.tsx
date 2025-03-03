import { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface TooltipButtonProps {
  tooltip: string
  onClick?: () => void
  children: ReactNode
  placement?: "top" | "right" | "bottom" | "left"
}

export function TooltipButton({ tooltip, onClick, children, placement = 'bottom' }: TooltipButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button 
            className="hover:bg-gray-200 rounded-lg p-2 relative cursor-pointer"
            onClick={onClick}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={placement} 
          align="center" 
          sideOffset={5}
          avoidCollisions={true}
          collisionPadding={8}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 