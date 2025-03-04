import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI客户端配置
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 验证请求
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "无效的请求格式" },
        { status: 400 }
      );
    }

    // 创建聊天完成
    const response = await openai.chat.completions.create({
      model: "azure-gpt-4o",
      messages: messages.map(({ content, role }) => ({
        content,
        role,
      })),
      stream: true,
    });

    // 创建响应流
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}