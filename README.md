# PDF Q&A App

A mini application built with Next.js that allows users to upload PDF files and ask questions about their content using either OpenAI or Google Generative AI.

## Features

- PDF file upload and text extraction
- Vector embeddings generation using OpenAI API or Google Generative AI
- Storage of embeddings in an in-memory vector store
- Question answering using Retrieval Augmented Generation (RAG)
- Simple and intuitive user interface with:
  - Drag-and-drop PDF upload
  - Chat-like conversation history
  - Real-time question and answer display

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **PDF Processing**: LangChain PDFLoader
- **Vector Storage**: LangChain MemoryVectorStore
- **AI**: OpenAI API or Google Gemini API (embeddings and completions)

## Setup Instructions

### Prerequisites

- Node.js (v22 or higher)
- Either OpenAI API key or Google API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/Tarunkashyap6665/pdf-qna-nextjs.git
cd pdf-qna-nextjs
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with one of the following API keys:

```
# If you want to use OpenAI
OPENAI_API_KEY=your_openai_api_key

# If you want to use Google Gemini
GOOGLE_API_KEY=your_google_api_key
```

Note: You only need to provide one of the API keys. The application will use OpenAI if the key is provided, otherwise it will fall back to Google Gemini.

### Running the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Approach

### PDF Processing and Embedding Generation

1. When a user uploads a PDF, the file is sent to the `/api/upload` endpoint.
2. The PDF text is extracted using LangChain's `PDFLoader`.
3. The text is split into smaller chunks with some overlap to maintain context using `RecursiveCharacterTextSplitter`.
4. Each chunk is converted into a vector embedding using either OpenAI's embedding API (text-embedding-3-large) or Google's Gemini embedding API (gemini-embedding-001).
5. The embeddings are stored in memory using LangChain's `MemoryVectorStore`.

### Question Answering

1. When a user asks a question, it's sent to the `/api/query` endpoint.
2. The question is used to retrieve relevant document chunks from the vector store using similarity search.
3. The vector store retrieves the top 3 most relevant chunks from the PDF.
4. The relevant chunks are combined and sent to either OpenAI's GPT-4 model or Google's Gemini model along with the question.
5. The model generates an answer based on the provided context, which is returned to the user and displayed in a chat-like interface.

### Security

- API routes are protected and only accessible from the frontend application.
- Environment variables are used to securely store API keys.
- Input validation is performed on both client and server sides.
