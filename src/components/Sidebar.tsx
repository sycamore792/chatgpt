import React, { Dispatch, SetStateAction } from 'react'
import { NewChatIcon } from './icons/NewChatIcon'
import { SearchChatIcon } from './icons/SearchChatIcon'
import { SidebarButtonIcon } from './icons/SidebarButtonIcon'
import { TooltipButton } from './ui/tooltip-button'
import { cn } from '@/lib/utils'

interface SidebarProps {
    isCollapsed: boolean
    setIsCollapsed: Dispatch<SetStateAction<boolean>>
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    return (
        <>
            {/* 收起时的按钮组 */}
            <div className={cn(
                "fixed left-4 top-4 flex items-center gap-1 transition-opacity duration-600",
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
                    onClick={() => {
                        console.log('新建会话')
                    }}
                >
                    <NewChatIcon />
                </TooltipButton>
            </div>

            {/* 边栏 */}
            <div className={cn(
                "fixed left-0 top-0 flex min-h-screen w-[260px] flex-col bg-gray-50 transition-transform duration-400",
                isCollapsed ? "-translate-x-full" : "translate-x-0"
            )}>
                {/* 顶部栏 */}
                <div className="flex items-center justify-between px-4 py-3">
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
                            onClick={() => {
                                console.log('新建会话')
                            }}
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