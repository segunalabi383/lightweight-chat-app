# Lightweight Chat App

A Next.js application that allows users to input prompts and receive AI responses from OpenAI or HuggingFace.

## Features

- Prompt input with submit button
- Integration with OpenAI or HuggingFace APIs
- Dynamic response display
- Loading states
- Error handling
- Chat history (bonus)
- Clear button (bonus)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your API key:
```
OPENAI_API_KEY=your_api_key_here
# OR
HUGGINGFACE_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your prompt in the input field
2. Click "Submit" to send the prompt to the AI API
3. View the response below
4. Use "Clear" to clear the chat history

