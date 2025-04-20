"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";

// This interface reflects your new data format.
interface MultipleChoiceQuestion {
  id: number;
  question: string;
  choices: string[];
  answer: string;
  category: string;
  classCodeId: number;
}

export default function MultipleChoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const className = searchParams.get("class"); // e.g. "Biology 101"

  const examId = searchParams.get("examId"); // Get exam ID from URL parameters

  // State for multiple choice questions and page logic
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // We'll store userAnswer as the index of the chosen option
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // For the progress bar
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  // 1) Helper function to get the class code from the class name
  const fetchClassCode = async (className: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `http://localhost:5051/api/Classes/code?className=${encodeURIComponent(
          className
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch class code");
      }
      const data = await response.json();
      // The API returns: { classCodeId: "BIO101" } (for example)
      return data.classCodeId;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching class code"
      );
      return null;
    }
  };

  // 2) Helper function to get MC questions from your new endpoint
  const fetchMultipleChoiceQuestions = async (classCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5051/api/multiplechoice/bycode?classCode=${encodeURIComponent(
          classCode
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch multiple choice questions.");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIndex(0);
        setUserAnswer(null);
        setShowFeedback(false);
      } else {
        setError("No questions available for the selected class.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching questions.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to fetch multiple choice questions for an exam
  const fetchMultipleChoiceByExam = async (examId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5051/api/multiplechoice/exam/${examId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch multiple choice questions for exam.");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIndex(0);
        setUserAnswer(null);
        setShowFeedback(false);
      } else {
        setError("No questions available for the selected exam.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching questions.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3) useEffect: fetch based on examId or className
  useEffect(() => {
    // If examId is provided, fetch questions by exam ID
    if (examId) {
      fetchMultipleChoiceByExam(examId);
    }
    // Otherwise use class name to fetch questions
    else if (className) {
      fetchClassCode(className).then((classCode) => {
        if (classCode) {
          fetchMultipleChoiceQuestions(classCode);
        } else {
          setError("Class code not found for the selected class.");
        }
      });
    }
  }, [className, examId]);

  // Called when the user clicks on a choice
  const handleAnswer = (choiceIndex: number) => {
    setUserAnswer(choiceIndex);
    setShowFeedback(true);

    // Delay to show feedback (Correct/Incorrect), then move to next question
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setUserAnswer(null);
        setShowFeedback(false);
      } else {
        setShowCompletionModal(true);
      }
    }, 1500);
  };

  // When the user finishes or wants to restart
  const handleRestart = () => {
    setCurrentIndex(0);
    setShowCompletionModal(false);
    setUserAnswer(null);
    setShowFeedback(false);
  };

  // We can label choices with letters A, B, C, D, etc.
  const letters = ["A", "B", "C", "D", "E"];

  // Are we correct? Compare the chosen text to the question's `answer` string
  const isCorrect = (choiceIndex: number) => {
    return (
      questions[currentIndex].choices[choiceIndex] ===
      questions[currentIndex].answer
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <StaticSparkles
        id="tsparticles"
        background="transparent"
        minSize={0.8}
        maxSize={1.8}
        particleDensity={100}
        className="fixed inset-0 pointer-events-none"
        particleColor="rgba(255, 255, 255, 0.5)"
      />

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111111] border border-[#222222] rounded-xl p-8 max-w-md w-full mx-4 flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Practice Complete!
              </h2>
              <p className="text-zinc-400 text-center mb-8">
                Would you like to practice these questions again?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-[#3B4CCA] text-white px-6 py-3 rounded-lg hover:bg-[#2D3A99] transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Restart
                </button>
                <button
                  onClick={() => router.push("/student-dashboard")}
                  className="px-6 py-3 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.push("/student-dashboard")}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Multiple Choice</span>
            </button>
            <button
              onClick={() => router.push("/student-dashboard")}
              className="text-zinc-400 hover:text-white transition-colors ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pb-4">
            <h1 className="text-2xl font-semibold text-white mb-2">
              {/* You can adapt this to display className or question category */}
              {className || "Multiple Choice Practice"}
            </h1>
            <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
              <span>
                {questions.length > 0
                  ? `${currentIndex + 1} / ${questions.length}`
                  : "0 / 0"}
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B4CCA] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* If there's an error or no questions, display a message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {isLoading && <p className="text-white mb-4">Loading...</p>}

          {questions.length > 0 && currentIndex < questions.length && (
            <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
              {/* Feedback Message */}
              <AnimatePresence mode="wait">
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-4xl font-medium text-[#3B4CCA]"
                  >
                    {isCorrect(userAnswer!)
                      ? "Correct!"
                      : `Incorrect. The correct answer was "${questions[currentIndex].answer}"`}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Question Card */}
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 50 }}
                className="w-full rounded-xl border border-[#222222] bg-[#111111] p-8 mb-8"
              >
                {/* Display the question text */}
                <div className="text-3xl font-medium text-white text-center mb-8">
                  {questions[currentIndex].question}
                </div>

                {/* Render the answer choices */}
                <div className="grid grid-cols-2 gap-4">
                  {questions[currentIndex].choices.map((choice, i) => {
                    // Are we in feedback mode, and is this the correct or chosen choice?
                    const isChoiceCorrect = showFeedback && isCorrect(i);

                    const isChoiceSelected =
                      showFeedback && userAnswer === i && !isChoiceCorrect;

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={showFeedback} // disable during feedback
                        className={`p-4 rounded-lg border ${
                          isChoiceCorrect
                            ? "border-green-500 bg-green-500/10"
                            : isChoiceSelected
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-800 hover:border-zinc-700"
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${
                              isChoiceCorrect
                                ? "bg-green-500"
                                : isChoiceSelected
                                ? "bg-red-500"
                                : "bg-zinc-800"
                            }`}
                            style={{ borderRadius: "9999px" }}
                          >
                            {/* Label each choice with A, B, C, D, etc. */}

                            <span className="text-white font-medium">
                              {letters[i]}
                            </span>
                          </div>
                          <span className="text-white text-left">{choice}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* If questions is empty or we've handled all questions, you might show placeholders */}
          {questions.length === 0 && !error && !isLoading && (
            <p className="text-white text-center">No questions to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
