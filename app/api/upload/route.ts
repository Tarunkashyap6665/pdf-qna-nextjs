import vectorStore from "@/storage/vectorStore";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Acess the uploaded file from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 }
      );
    }
    // Process the PDF file using PDFLoader
    const loader = new PDFLoader(file);
    const docs = await loader.load();

    // Split the document into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const allSplits = await textSplitter.splitDocuments(docs);

    // Add the document chunks to the vector store
    await vectorStore.addDocuments(allSplits);

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "PDF processed successfully",
    });
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process PDF" },
      { status: 500 }
    );
  }
}
