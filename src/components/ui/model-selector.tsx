import React, { useState } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { ChevronDown, Sparkles, MessageSquare, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Model {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  isPro?: boolean
}

const models: Model[] = [
  {
    id: 'gpt4',
    name: 'ChatGPT Plus',
    description: '我们最智能的模型和更多内容',
    icon: <Sparkles className="w-4 h-4" />,
    isPro: true
  },
  {
    id: 'gpt3',
    name: 'ChatGPT',
    description: '非常适合用于日常任务',
    icon: <MessageSquare className="w-4 h-4" />
  },
  {
    id: 'gpt35',
    name: '临时聊天',
    description: '不保存历史记录',
    icon: <Clock className="w-4 h-4" />
  }
]

interface ModelSelectorProps {
  currentModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentModelData = models.find(m => m.id === currentModel) || models[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            {currentModelData.icon}
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">{currentModelData.name}</span>
              <span className="text-xs text-gray-500">{currentModelData.description}</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className={cn(
              "flex items-center gap-2 p-3 cursor-pointer",
              model.id === currentModel && "bg-gray-100"
            )}
            onClick={() => {
              onModelChange(model.id)
              setIsOpen(false)
            }}
          >
            <div className="flex items-center gap-2 flex-1">
              {model.icon}
              <div className="flex flex-col">
                <span className="font-medium flex items-center gap-2">
                  {model.name}
                  {model.isPro && (
                    <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">
                      升级
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500">{model.description}</span>
              </div>
            </div>
            {model.id === currentModel && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 