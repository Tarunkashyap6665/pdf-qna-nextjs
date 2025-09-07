import React, { useEffect, useRef } from "react";

interface QuestionAnswerProps {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  conversations: { question: string; answer: string }[];
  handleAskQuestion: () => void;
  querying: boolean;
  queryError: string;
  uploadSuccess: boolean;
}

export const QuestionAnswer = ({
  question,
  setQuestion,
  conversations,
  handleAskQuestion,
  querying,
  queryError,
  uploadSuccess,
}: QuestionAnswerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>

      {/* Conversation History */}
      {conversations.length > 0 && (
        <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={index}
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {/* Question */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 flex">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Question
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {conv.question}
                  </p>
                </div>
              </div>

              {/* Answer */}
              <div className="p-4 bg-white dark:bg-gray-800 flex">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 mr-3 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Answer
                  </p>
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {conv.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Question Input */}
      <div className="mb-4">
        <label htmlFor="question" className="block text-sm font-medium mb-1">
          Your Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the PDF content..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          disabled={!uploadSuccess || querying}
        />
      </div>

      {queryError && <p className="text-red-500 mb-2 text-sm">{queryError}</p>}

      <button
        onClick={handleAskQuestion}
        disabled={!uploadSuccess || !question.trim() || querying}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {querying ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Getting Answer...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Ask Question
          </>
        )}
      </button>
    </section>
  );
};
