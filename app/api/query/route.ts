import vectorStore from "@/storage/vectorStore";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// PromptTemplate
const prompt = ChatPromptTemplate.fromMessages([
  {
    role: "system",
    content: `You are a helpful assistant that answers questions based on the provided context from a PDF document.
          If the answer cannot be found in the context, politely state that you don't have enough information to answer accurately.
          Always base your answers on the provided context and avoid making up information.`,
  },
  {
    role: "user",
    content:
      "Context: {context}\n\nQuestion: {query}\n\nAnswer the question based on the context provided.",
  },
]);

// LLM
let llm: ChatOpenAI | ChatGoogleGenerativeAI;
if (process.env.OPENAI_API_KEY) {
  llm = new ChatOpenAI({ model: "gpt-4" });
} else {
  llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Query is required" },
        { status: 400 }
      );
    }

    // Create a retriever from the vector store
    const retriever = await vectorStore.asRetriever({
      searchType: "similarity",
      k: 3, // Number of documents to retrieve
    });

    // Retrieve relevant documents based on the query
    const documents = await retriever.invoke(query);

    // Format the retrieved documents into a context string
    const context = documents.map((doc) => `${doc.pageContent}`).join("\n\n");

    // Create a chain with the prompt and LLM
    const pdf_qna = await prompt.pipe(llm);

    // Generate a response using the context and query
    const response = await pdf_qna.invoke({
      context: context,
      query: query,
    });

    return NextResponse.json({
      success: true,
      answer: response.content || "No answer generated",
    });
  } catch (error: any) {
    console.error("Error querying PDF:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to query PDF" },
      { status: 500 }
    );
  }
}
