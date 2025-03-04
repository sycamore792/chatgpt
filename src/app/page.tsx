"use client"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ScrollButton } from "@/components/ui/scroll-button"
import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip, Square, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { MessageContent } from "@/components/ui/message"
import { ChatContainer } from "@/components/ui/chat-container"
import {
  Message, MessageAction,
  MessageActions,
} from "@/components/ui/message"
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react"
import { Layout } from '@/components/Layout'

export default function Home() {
  const [autoScroll, setAutoScroll] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamContentRef = useRef("")


  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "user",
      content: "Hello! Can you help me with a coding question?",
    },
    {
      id: 2,
      role: "assistant",
      content:
        "## Of course! I'd be happy to help with your coding question. What would you like to know?",
    },
    {
      id: 3,
      role: "user",
      content: "How do I create a responsive layout with CSS Grid?",
    },
    {
      id: 4,
      role: "assistant",
      content:
        " Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
    },
  ])
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      streamResponse()
    }
  }, [messages]);
  const streamResponse = () => {
    if (isStreaming) return

    setIsStreaming(true)
    const fullResponse =
      "Yes, I'd be happy to explain more about CSS Grid! The `grid-template-columns` property defines the columns in your grid. The `repeat()` function is a shorthand that repeats a pattern. `auto-fit` will fit as many columns as possible in the available space. The `minmax()` function sets a minimum and maximum size for each column. This creates a responsive layout that automatically adjusts based on the available space without requiring media queries."

    const newMessageId = messages.length + 1
    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        role: "assistant",
        content: "",
      },
    ])

    let charIndex = 0
    streamContentRef.current = ""

    streamIntervalRef.current = setInterval(() => {
      if (charIndex < fullResponse.length) {
        streamContentRef.current += fullResponse[charIndex]
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessageId
              ? { ...msg, content: streamContentRef.current }
              : msg
          )
        )
        charIndex++
      } else {
        clearInterval(streamIntervalRef.current!)
        setIsStreaming(false)
        setIsLoading(false)
      }
    }, 5)
  }
  const addMessage = () => {
    // setIsStreaming(true);

    // Add a new message
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role:
          messages[messages.length - 1].role === "user" ? "assistant" : "user",
        content:
          messages[messages.length - 1].role === "user"
            ? "That's a great question! Let me explain further. CSS Grid is a powerful layout system that allows for two-dimensional layouts. The `minmax()` function is particularly useful as it sets a minimum and maximum size for grid tracks."
            : "Thanks for the explanation! Could you tell me more about grid areas?",
      },
    ])
  }


  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)
  const [titleInput, setTitleInput] = useState("")



  const handleCopy = () => {
    const text =
      "I can help with a variety of tasks:\n\n- Answering questions\n- Providing information\n- Assisting with coding\n- Generating creative content\n\nWhat would you like help with today?"
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    if (isChatStarted) {
      if (!input.trim()) return
      setIsLoading(true)
      setTimeout(() => {
        setInput("")
        addMessage()
        setIsLoading(false)
      }, 1000)
    } else {
      if (!titleInput.trim() && !input.trim()) return
      setIsLoading(true)
      setIsChatStarted(true)
      setTimeout(() => {
        const content = titleInput.trim()
          ? `${titleInput}\n\n${input}`
          : input
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            role: "user",
            content: content,
          },
        ])
        setTitleInput("")
        setInput("")
        setIsLoading(false)
      }, 1000)
    }
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

    <div className="flex ">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className="flex-1">
        <div >
          <div className="flex h-screen">
            <main className={cn(
              "flex flex-1 flex-col h-screen",
            )}>
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                </div>
              </div>

              {/* Main Content */}
              <div className={cn(
                "flex flex-col flex-1 overflow-hidden",
                isChatStarted ? "relative" : "items-center justify-center"
              )}>
                {/* chat container */}
                <div className={cn(
                  "flex-1 overflow-hidden w-full",
                  !isChatStarted && "flex flex-col items-center justify-center"
                )}>
                  {!isChatStarted ? (
                    <>
                      <h1 className="mb-8 text-3xl font-semibold text-center">有什么可以帮忙的？</h1>

                      {/* 中间的输入框区域 */}
                      <div className="w-full max-w-3xl px-4">

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
                                  htmlFor="file-upload-bottom"
                                  className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                                >
                                  <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload-bottom"
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
                    </>
                  ) : (
                    <ChatContainer
                      id="chat-container"
                      className="h-full"
                      autoScroll={autoScroll}
                      ref={chatContainerRef}
                    >
                      <div className="space-y-8  p-70 ">
                        {messages.map((message) => {
                          const isAssistant = message.role === "assistant"

                          return (
                            <Message
                              key={message.id}
                              className={cn(
                                "gap-3 ",
                                message.role === "user" ? "justify-end" : "justify-start"
                              )}
                            >
                              {isAssistant ? (
                                <>
                                  <div className="flex-1 ">
                                    <MessageContent markdown className="bg-transparent p-0">
                                      {message.content}
                                    </MessageContent>
                                    <MessageActions className="self-end">
                                      <MessageAction tooltip="Copy to clipboard">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 rounded-full"
                                          onClick={handleCopy}
                                        >
                                          <Copy className={`size-4 ${copied ? "text-green-500" : ""}`} />
                                        </Button>
                                      </MessageAction>

                                      <MessageAction tooltip="Helpful">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className={`h-8 w-8 rounded-full ${liked === true ? "bg-green-100 text-green-500" : ""}`}
                                          onClick={() => setLiked(true)}
                                        >
                                          <ThumbsUp className="size-4" />
                                        </Button>
                                      </MessageAction>

                                      <MessageAction tooltip="Not helpful">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className={`h-8 w-8 rounded-full ${liked === false ? "bg-red-100 text-red-500" : ""}`}
                                          onClick={() => setLiked(false)}
                                        >
                                          <ThumbsDown className="size-4" />
                                        </Button>
                                      </MessageAction>
                                    </MessageActions>
                                  </div>


                                </>

                              ) : (

                                <MessageContent>
                                  {message.content}
                                </MessageContent>

                              )}
                            </Message>
                          )
                        })}
                      </div>


                    </ChatContainer>
                  )}
                </div>

                {/* chat input - 只在isChatStarted为true时显示在底部 */}
                {isChatStarted && (
                  <div className="w-full max-w-3xl mx-auto px-4 pb-4 ">

                    <div className="flex justify-center mb-2">
                      <ScrollButton
                        containerRef={chatContainerRef}
                        scrollRef={chatContainerRef}
                        className="shadow-sm"
                      />
                    </div>

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
                              htmlFor="file-upload-bottom"
                              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
                            >
                              <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload-bottom"
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
                )}
              </div>
            </main>
          </div>
        </div>
      </main>
    </div>


  )
}
