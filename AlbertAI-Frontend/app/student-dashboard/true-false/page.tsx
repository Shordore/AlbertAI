"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";

interface TrueFalseQuestion {
  question: string;
  answer: boolean;
}

const questions: TrueFalseQuestion[] = [
  {
    question: "The mitochondria is the powerhouse of the cell",
    answer: true,
  },
  {
    question: "DNA is a single-stranded molecule",
    answer: false,
  },
  {
    question: "Photosynthesis occurs in animal cells",
    answer: false,
  },
  {
    question: "The human body has 206 bones",
    answer: true,
  },
  {
    question: "All bacteria are harmful to humans",
    answer: false,
  },
];

export default function TrueFalsePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgb(239, 68, 68)", "rgb(17, 17, 17)", "rgb(34, 197, 94)"]
  );

  const progress = (currentIndex / questions.length) * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleSwipe(false);
        animate(x, -300, {
          type: "spring",
          stiffness: 400,
          damping: 30,
        });
      } else if (e.key === "ArrowRight") {
        handleSwipe(true);
        animate(x, 300, {
          type: "spring",
          stiffness: 400,
          damping: 30,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowCompletionModal(false);
    setUserAnswer(null);
    setShowFeedback(false);
    animate(x, 0);
  };

  const handleSwipe = (isTrue: boolean) => {
    setUserAnswer(isTrue);
    setShowFeedback(true);
    setDirection(isTrue ? 1 : -1);

    setTimeout(() => {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 30,
      });
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setUserAnswer(null);
        setShowFeedback(false);
      } else {
        setShowCompletionModal(true);
      }
    }, 1000);
  };

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    if (offset > 100) {
      handleSwipe(true);
    } else if (offset < -100) {
      handleSwipe(false);
    }
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
              <span>True/False</span>
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
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-6">
            {/* Feedback Message */}
            <AnimatePresence mode="wait">
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-2xl font-medium text-[#3B4CCA]"
                >
                  {userAnswer === questions[currentIndex].answer
                    ? "Correct!"
                    : "Incorrect"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card */}
            <div className="relative w-[800px] h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  style={{
                    x,
                    rotate,
                    opacity,
                    background,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 50 }}
                  className="absolute inset-0 rounded-xl border border-[#222222] flex flex-col items-center justify-center p-12 cursor-grab active:cursor-grabbing"
                >
                  <div className="text-4xl font-medium text-white text-center">
                    {questions[currentIndex].question}
                  </div>

                  {/* Swipe Indicators */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-between px-12">
                    <motion.div
                      style={{ opacity: useTransform(x, [0, -100], [0.5, 1]) }}
                    >
                      <div className="flex items-center gap-2 text-red-500">
                        <X className="w-6 h-6" />
                        <span className="font-medium">False</span>
                      </div>
                    </motion.div>
                    <motion.div
                      style={{ opacity: useTransform(x, [0, 100], [0.5, 1]) }}
                    >
                      <div className="flex items-center gap-2 text-green-500">
                        <Check className="w-6 h-6" />
                        <span className="font-medium">True</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center pb-6 text-zinc-400">
          <p>Swipe right for True, left for False, or use arrow keys →/←</p>
        </div>
      </div>
    </div>
  );
}
