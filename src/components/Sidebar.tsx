import React, { Dispatch, SetStateAction } from 'react'
import { NewChatIcon } from './icons/NewChatIcon'
import { SearchChatIcon } from './icons/SearchChatIcon'
import { SidebarButtonIcon } from './icons/SidebarButtonIcon'
import { TooltipButton } from './ui/tooltip-button'
import { cn } from '@/lib/utils'

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: Dispatch<SetStateAction<boolean>>
    onNewChat?: () => void
}

export function Sidebar({ isCollapsed, setIsCollapsed, onNewChat }: SidebarProps) {
    const handleNewChat = () => {
        onNewChat?.()
    }

    return (
        <>
            

            {/* 边栏 */}
            <div className={cn(
                "flex h-screen flex-col bg-gray-50 transition-[width] duration-300 ease-in-out overflow-hidden",
                isCollapsed ? "w-0" : "w-[260px]"
            )}>
                {/* 顶部栏 */}
                <div className=" flex items-center justify-between px-4 py-4">
                    <div>
                        <TooltipButton
                            tooltip="关闭边栏"
                            placement="right"
                            onClick={() => setIsCollapsed(true)}
                        >
                            <SidebarButtonIcon />
                        </TooltipButton>
                    </div>

                    <div className="flex items-center gap-1">
                        <TooltipButton
                            tooltip="搜索聊天"
                            placement="bottom"
                            onClick={() => {
                                console.log('搜索聊天')
                            }}
                        >
                            <SearchChatIcon />
                        </TooltipButton>
                        
                        <TooltipButton
                            tooltip="新聊天"
                            placement="bottom"
                            onClick={handleNewChat}
                        >
                            <NewChatIcon />
                        </TooltipButton>
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="flex-1">
                    {/* 聊天列表等内容 */}
                </div>
            </div>
        </>
    )
}  