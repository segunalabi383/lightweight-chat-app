import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lightweight Chat App',
  description: 'AI Chat Application with OpenAI/HuggingFace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

