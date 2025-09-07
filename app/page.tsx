"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { PdfUpload } from "@/components/pdf-upload";
import { QuestionAnswer } from "@/components/question-answer";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState<
    { question: string; answer: string }[]
  >([]);
  const [querying, setQuerying] = useState(false);
  const [queryError, setQueryError] = useState("");

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setUploadError("");
      } else {
        setUploadError("Please upload a PDF file");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
      } else {
        setUploadError(data.message || "Failed to upload PDF");
      }
    } catch (error: any) {
      setUploadError(error.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  // Handle question submission
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setQueryError("Please enter a question");
      return;
    }

    try {
      setQuerying(true);
      setQueryError("");

      const currentQuestion = question;
      // Clear the question input for next question
      setQuestion("");

      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: currentQuestion,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new question and answer to conversations
        setConversations((prev) => [
          ...prev,
          {
            question: currentQuestion,
            answer: data.answer,
          },
        ]);
      } else {
        setQueryError(data.message || "Failed to get answer");
      }
    } catch (error: any) {
      setQueryError(error.message || "An error occurred while querying");
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">PDF Q&A App</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload a PDF and ask questions about its content
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* PDF Upload Section */}
        <PdfUpload
          file={file}
          uploading={uploading}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
          handleUpload={handleUpload}
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />

        {/* Question & Answer Section */}
        <QuestionAnswer
          question={question}
          setQuestion={setQuestion}
          conversations={conversations}
          handleAskQuestion={handleAskQuestion}
          querying={querying}
          queryError={queryError}
          uploadSuccess={uploadSuccess}
        />
      </main>
    </div>
  );
}
