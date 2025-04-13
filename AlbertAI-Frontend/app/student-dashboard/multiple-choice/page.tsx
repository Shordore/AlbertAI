"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";

interface MultipleChoiceQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
}

const questions: MultipleChoiceQuestion[] = [
  {
    question: "What is the powerhouse of the cell?",
    options: {
      A: "Nucleus",
      B: "Mitochondria",
      C: "Ribosome",
      D: "Endoplasmic Reticulum",
    },
    correctAnswer: "B",
  },
  {
    question: "Which of these is NOT a type of RNA?",
    options: {
      A: "mRNA",
      B: "tRNA",
      C: "rRNA",
      D: "zRNA",
    },
    correctAnswer: "D",
  },
  {
    question: "What is the process by which plants make their own food?",
    options: {
      A: "Respiration",
      B: "Photosynthesis",
      C: "Transpiration",
      D: "Digestion",
    },
    correctAnswer: "B",
  },
];

export default function MultipleChoicePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<"A" | "B" | "C" | "D" | null>(
    null
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: "A" | "B" | "C" | "D") => {
    setUserAnswer(answer);
    setShowFeedback(true);

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

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowCompletionModal(false);
    setUserAnswer(null);
    setShowFeedback(false);
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
              Biology 101 - Chapter 1
            </h1>
            <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
              <span>
                {currentIndex + 1} / {questions.length}
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

        {/* Question Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
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
                  {userAnswer === questions[currentIndex].correctAnswer
                    ? "Correct!"
                    : `Incorrect. The correct answer was ${questions[currentIndex].correctAnswer}`}
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
              <div className="text-3xl font-medium text-white text-center mb-8">
                {questions[currentIndex].question}
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(questions[currentIndex].options).map(
                  ([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleAnswer(key as "A" | "B" | "C" | "D")}
                      disabled={showFeedback}
                      className={`p-4 rounded-lg border ${
                        showFeedback
                          ? key === questions[currentIndex].correctAnswer
                            ? "border-green-500 bg-green-500/10"
                            : userAnswer === key
                            ? "border-red-500 bg-red-500/10"
                            : "border-zinc-800"
                          : "border-zinc-800 hover:border-zinc-700"
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            showFeedback
                              ? key === questions[currentIndex].correctAnswer
                                ? "bg-green-500"
                                : userAnswer === key
                                ? "bg-red-500"
                                : "bg-zinc-800"
                              : "bg-zinc-800"
                          }`}
                        >
                          <span className="text-white font-medium">{key}</span>
                        </div>
                        <span className="text-white text-left">{value}</span>
                      </div>
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
