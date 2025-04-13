"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, Check, X as XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { StaticSparkles } from "@/components/static-sparkles";

interface Question {
  id: number;
  type: "multiple-choice" | "true-false";
  question: string;
  options: string[];
  correctAnswer: number;
}

// Sample questions data - this would typically come from your backend
const sampleQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "true-false",
    question: "Photosynthesis occurs in the mitochondria.",
    options: ["True", "False"],
    correctAnswer: 1,
  },
  {
    id: 3,
    type: "multiple-choice",
    question: "Which of these is not a type of RNA?",
    options: ["mRNA", "tRNA", "rRNA", "dRNA"],
    correctAnswer: 3,
  },
];

export default function PracticeTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [answers, setAnswers] = useState<number[]>(
    Array(sampleQuestions.length).fill(-1)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (!isSubmitted) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = answerIndex;
      setAnswers(newAnswers);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    const percentage = (correctAnswers / questions.length) * 100;
    setScore(percentage);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers(Array(sampleQuestions.length).fill(-1));
    setIsSubmitted(false);
    setScore(null);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Particle Background */}
      <StaticSparkles
        id="tsparticles"
        background="transparent"
        minSize={0.8}
        maxSize={1.8}
        particleDensity={100}
        className="fixed inset-0 pointer-events-none"
        particleColor="rgba(255, 255, 255, 0.5)"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <button
            onClick={() => router.push("/student-dashboard")}
            className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Practice Test</span>
          </button>
          <button
            onClick={() => router.push("/student-dashboard")}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold text-white mb-6">
              Biology 101 - Practice Test
            </h1>

            {questions.map((question, questionIndex) => (
              <div
                key={question.id}
                className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3B4CCA] flex items-center justify-center text-white font-medium">
                    {questionIndex + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg mb-4">
                      {question.question}
                    </p>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => {
                        const isSelected =
                          answers[questionIndex] === optionIndex;
                        const isCorrect =
                          isSubmitted && optionIndex === question.correctAnswer;
                        const isWrong =
                          isSubmitted &&
                          isSelected &&
                          optionIndex !== question.correctAnswer;

                        return (
                          <button
                            key={optionIndex}
                            onClick={() =>
                              handleAnswerSelect(questionIndex, optionIndex)
                            }
                            disabled={isSubmitted}
                            className={`w-full p-4 rounded-lg text-left transition-colors
                              ${
                                isSelected
                                  ? "bg-[#3B4CCA] text-white"
                                  : "bg-[#1A1A1A] text-zinc-300"
                              }
                              ${isCorrect ? "border-2 border-green-500" : ""}
                              ${isWrong ? "border-2 border-red-500" : ""}
                              ${
                                !isSubmitted && !isSelected
                                  ? "hover:bg-[#2A2A2A]"
                                  : ""
                              } disabled:hover:bg-[#1A1A1A]`}
                          >
                            <div className="flex items-center gap-3">
                              {isCorrect && (
                                <Check className="w-5 h-5 text-green-500" />
                              )}
                              {isWrong && (
                                <XIcon className="w-5 h-5 text-red-500" />
                              )}
                              <span>{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            {!isSubmitted ? (
              <button
                onClick={calculateScore}
                disabled={answers.includes(-1)}
                className="w-full py-4 bg-[#3B4CCA] text-white rounded-xl font-medium
                  hover:bg-[#2A3BAA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Test
              </button>
            ) : (
              <div className="bg-[#111111] border border-[#222222] rounded-xl p-6 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Test Complete!
                  </h2>
                  <p className="text-4xl font-bold text-[#3B4CCA]">
                    {score?.toFixed(1)}%
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleRetake}
                    className="flex-1 py-3 bg-[#3B4CCA] text-white rounded-xl font-medium
                      hover:bg-[#2A3BAA] transition-colors"
                  >
                    Take Another Test
                  </button>
                  <button
                    onClick={() => router.push("/student-dashboard")}
                    className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl font-medium
                      hover:bg-[#2A2A2A] transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
