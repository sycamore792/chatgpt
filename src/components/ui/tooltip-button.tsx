import React, { ReactNode, useState, useCallback } from 'react'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipButtonProps {
  tooltip: string
  onClick?: () => void
  children: ReactNode
  placement?: TooltipPlacement
}

const placementStyles = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow: "top-full left-1/2 -translate-x-1/2 border-t-[5px] border-l-[5px] border-r-[5px] border-t-gray-800 border-l-transparent border-r-transparent"
  },
  bottom: {
    tooltip: "-bottom-11 left-1/2 -translate-x-1/2",
    arrow: "-top-[5px] left-1/2 -translate-x-1/2 border-b-[5px] border-l-[5px] border-r-[5px] border-b-gray-800 border-l-transparent border-r-transparent"
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow: "left-full top-1/2 -translate-y-1/2 border-l-[5px] border-t-[5px] border-b-[5px] border-l-gray-800 border-t-transparent border-b-transparent"
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow: "right-full top-1/2 -translate-y-1/2 border-r-[5px] border-t-[5px] border-b-[5px] border-r-gray-800 border-t-transparent border-b-transparent"
  }
}

export function TooltipButton({ tooltip, onClick, children, placement = 'bottom' }: TooltipButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  let timeoutId: NodeJS.Timeout | null = null

  const handleMouseEnter = useCallback(() => {
    timeoutId = setTimeout(() => {
      setShowTooltip(true)
    }, 200)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setShowTooltip(false)
  }, [])

  const { tooltip: tooltipPosition, arrow: arrowPosition } = placementStyles[placement]

  return (
    <button 
      className="hover:bg-gray-200 rounded-lg p-2 relative cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div className={`absolute px-2 py-1 text-sm text-white bg-gray-800 rounded whitespace-nowrap ${tooltipPosition}`}>
          <div className={`absolute w-0 h-0 ${arrowPosition}`}></div>
          {tooltip}
        </div>
      )}
    </button>
  )
} 