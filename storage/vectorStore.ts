import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

let embeddings;
// Embeddings
console.log(
  "Using embeddings:",
  process.env.OPENAI_API_KEY ? "OpenAI" : "Google Generative AI"
);
if (process.env.OPENAI_API_KEY) {
  embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
} else {
  embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
  });
}

// Vector Store
const vectorStore = new MemoryVectorStore(embeddings);

export default vectorStore;
