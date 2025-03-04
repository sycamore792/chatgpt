import OpenAI from 'openai';

// OpenAI客户端配置
const openai = new OpenAI({ 
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
  baseURL:process.env.NEXT_PUBLIC_OPENAI_BASE_URL ||  "https://api.openai.com/v1",
});

// 消息类型定义
export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

// API响应类型
interface ApiError {
  error: string;
}

// 聊天API接口
export class ChatAPI {
  private static instance: ChatAPI;
  private messageHistory: { role: string; content: string; }[];
  
  private constructor() {
    this.messageHistory = [];
  }
  
  public static getInstance(): ChatAPI {
    if (!ChatAPI.instance) {
      ChatAPI.instance = new ChatAPI();
    }
    return ChatAPI.instance;
  }

  // 流式聊天响应
  public async streamChatResponse(
    userInput: string,
    onProgress: (content: string) => void,
    onError: (error: any) => void
  ) {
    try {
      // 添加用户消息到历史记录
      this.messageHistory.push({
        role: 'user',
        content: userInput
      });

      // 发送请求到后端API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.messageHistory
        }),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || '请求失败');
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;
        onProgress(accumulatedContent);
      }

      // 添加助手响应到历史记录
      this.messageHistory.push({
        role: 'assistant',
        content: accumulatedContent
      });
      
      return accumulatedContent;
    } catch (error) {
      onError(error);
      throw error;
    }
  }

  // 清除聊天历史
  public clearHistory(): void {
    this.messageHistory = [];
  }
}

// 导出单例实例
export const chatAPI = ChatAPI.getInstance(); 