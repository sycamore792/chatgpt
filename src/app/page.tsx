"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip, Square, X } from "lucide-react"
import { useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"


export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSubmit = () => {
    if (!input.trim()) return
    setIsLoading(true)
    // TODO: 处理提交逻辑
    setTimeout(() => {
      setIsLoading(false)
      setInput("")
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      {/* 主要内容区域 */}
      <main className={cn(
        "flex flex-1 flex-col transition-[margin] duration-300",
        !isCollapsed && "ml-[260px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            
            {/* <h1 className="text-xl font-semibold">ChatGPT</h1> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl">
            <h1 className="mb-8 text-3xl font-semibold text-center">有什么可以帮忙的？</h1>
            
            <PromptInput
              value={input}
              onValueChange={setInput}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              className="w-full shadow"
            >
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                    >
                      <Paperclip className="size-4" />
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="hover:bg-secondary/50 rounded-full p-1"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <PromptInputTextarea placeholder="询问任何问题..." />

              <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <PromptInputAction tooltip="附加文件">
                    <label
                      htmlFor="file-upload"
                      className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Paperclip className="text-primary size-5" />
                    </label>
                  </PromptInputAction>
                </div>

                <PromptInputAction
                  tooltip={isLoading ? "停止生成" : "发送消息"}
                >
                  <Button
                    variant="default"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <Square className="size-3 fill-current" />
                    ) : (
                      <ArrowUp className="size-5" />
                    )}
                  </Button>
                </PromptInputAction>
              </PromptInputActions>
            </PromptInput>
          </div>
        </div>
      </main>
    </div>
  )
}
