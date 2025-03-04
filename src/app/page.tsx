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
import { Loader } from "@/components/ui/loader"
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
import { chatAPI, type ChatMessage } from "@/lib/api"
import { TooltipButton } from "@/components/ui/tooltip-button"
import { NewChatIcon } from "@/components/icons/NewChatIcon"
import { SidebarButtonIcon } from "@/components/icons/SidebarButtonIcon"

export default function Home() {
  const [autoScroll, setAutoScroll] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [currentStreamingId, setCurrentStreamingId] = useState<number | null>(null)

  // 初始欢迎消息
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // 重置对话
  const resetChat = () => {
    setMessages([])
    setIsChatStarted(false)
    setInput("")
    setTitleInput("")
    setFiles([])
    setCurrentStreamingId(null)
    chatAPI.clearHistory()
  }

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    try {
      // 这里可以添加文件处理逻辑
      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target?.result as string
        addMessage("user", `我上传了一个文件：${file.name}\n\n${content}`)
      }
      reader.readAsText(file)
    } catch (error) {
      console.error('文件处理失败:', error)
    }
  }

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      streamChatResponse()
    }
  }, [messages]);

  const streamChatResponse = async () => {
    if (isStreaming) return

    setIsStreaming(true)
    const userInput = messages[messages.length - 1].content
    const newMessageId = messages.length + 1
    
    // 设置当前正在流式传输的消息 ID
    setCurrentStreamingId(newMessageId)

    setMessages(prev => [
      ...prev,
      {
        id: newMessageId,
        role: "assistant",
        content: "",
      },
    ])

    try {
      await chatAPI.streamChatResponse(
        userInput,
        (content) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === newMessageId
                ? { ...msg, content }
                : msg
            )
          )

          // 自动滚动到底部
          if (chatContainerRef.current && autoScroll) {
            chatContainerRef.current.scrollTo({
              top: chatContainerRef.current.scrollHeight,
              behavior: 'smooth'
            })
          }
        },
        handleError
      )
    } catch (error) {
      handleError(error)
    } finally {
      setIsStreaming(false)
      // 重置当前流式传输的消息 ID
      setCurrentStreamingId(null)
      setIsLoading(false)
    }
  }

  const addMessage = (role: string, content: string) => {
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role: role as "user" | "assistant",
        content: content
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

  const handleSubmit = async () => {
    try {
      let _input = input.trim()

      if (!_input && (!isChatStarted || !titleInput.trim())) {
        return
      }

      setIsLoading(true)

      if (isChatStarted) {
        // 已开始对话，直接添加用户消息
        addMessage("user", _input)
        setInput("")
      } else {
        // 首次开始对话
        const content = titleInput.trim()
          ? `${titleInput}\n\n${_input}`
          : _input

        setIsChatStarted(true)
        addMessage("user", content)
        setTitleInput("")
        setInput("")
      }

      // 自动滚动到底部
      if (chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          })
        }, 100)
      }

    } catch (error) {
      console.error('提交消息失败:', error)
      // 可以在这里添加错误提示UI
    } finally {
      // 如果没有触发streamChatResponse，需要在这里关闭loading
      if (!messages.length || messages[messages.length - 1].role !== 'user') {
        setIsLoading(false)
      }
    }
  }

  // 添加一个处理错误的函数
  const handleError = (error: any) => {
    console.error('Stream failed:', error)
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1]
      if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.content) {
        // 如果最后一条是空的助手消息，则添加错误提示
        return prev.map(msg =>
          msg.id === lastMessage.id
            ? { ...msg, content: '抱歉，处理您的请求时出现错误。请重试。' }
            : msg
        )
      }
      return prev
    })
    
    // 重置流式传输状态
    setIsStreaming(false)
    setCurrentStreamingId(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
      // 处理新上传的文件
      newFiles.forEach(handleFileUpload)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="flex ">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onNewChat={resetChat}
      />
      <main className="flex-1">
        <div >
          <div className="flex h-screen">
            <main className={cn(
              "flex flex-1 flex-col h-screen",
            )}>
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                {/* 收起时的按钮组 */}
                <div className={cn(
                  "fixed left-4 top-4 flex items-center gap-1 transition-opacity duration-600 z-50",
                  isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                  <TooltipButton
                    tooltip="展开边栏"
                    placement="bottom"
                    onClick={() => setIsCollapsed(false)}
                  >
                    <SidebarButtonIcon />
                  </TooltipButton>
                  <TooltipButton
                    tooltip="新聊天"
                    placement="bottom"
                    onClick={resetChat}
                  >
                    <NewChatIcon />
                  </TooltipButton>
                </div>

                <div className={cn(
                  isCollapsed ? "ml-24" : "ml-0"
                )}>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={resetChat}
                    className="text-muted-foreground font-bold text-gray-600 text-xl"
                  >
                    GPT-4o
                  </Button>
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
                                    <MessageContent 
                                      markdown 
                                      className={cn(
                                        "bg-transparent p-0",
                                        isStreaming && message.id === currentStreamingId ? "typing-message" : ""
                                      )}
                                      typewriterCursor={isStreaming && message.id === currentStreamingId}
                                    >
                                      
                                      {message.content}
                                    </MessageContent>
                                    {/* <Loader variant={"pulse-dot"} text={message.content} /> */}
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
