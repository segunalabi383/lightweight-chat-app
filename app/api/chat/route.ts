import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Check for API keys
    const openaiKey = process.env.OPENAI_API_KEY
    const huggingfaceKey = process.env.HUGGINGFACE_API_KEY

    if (!openaiKey && !huggingfaceKey) {
      return NextResponse.json(
        { error: 'No API key configured. Please set OPENAI_API_KEY or HUGGINGFACE_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    // Prefer OpenAI if both are available, otherwise use HuggingFace
    if (openaiKey) {
      return await handleOpenAI(prompt, openaiKey)
    } else {
      return await handleHuggingFace(prompt, huggingfaceKey!)
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleOpenAI(prompt: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return NextResponse.json({
    response: data.choices[0]?.message?.content || 'No response received',
  })
}

async function handleHuggingFace(prompt: string, apiKey: string) {
  // Using a popular chat model from HuggingFace
  const model = 'microsoft/DialoGPT-medium'
  
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
        },
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HuggingFace API error: ${response.statusText}`)
  }

  const data = await response.json()
  
  // HuggingFace response format varies by model
  // For text generation models, the response is usually in data[0].generated_text
  let responseText = ''
  if (Array.isArray(data) && data[0]?.generated_text) {
    responseText = data[0].generated_text
  } else if (data.generated_text) {
    responseText = data.generated_text
  } else if (typeof data === 'string') {
    responseText = data
  } else {
    responseText = JSON.stringify(data)
  }

  return NextResponse.json({
    response: responseText,
  })
}

