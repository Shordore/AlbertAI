"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, RotateCcw, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  // Optionally, if returned by your API, you can include other fields like classCodeId.
}

export default function TrueFalsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const className = searchParams.get("class"); // e.g. "Biology 101"

  // State to store dynamic true/false questions
  const [questions, setQuestions] = useState<TrueFalseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Motion values and hooks called at the top-level so they’re not conditional
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const background = useTransform(
    x,
    [-200, 0, 200],
    ["rgb(239, 68, 68)", "rgb(17, 17, 17)", "rgb(34, 197, 94)"]
  );
  // Define left and right opacities outside of the JSX to avoid conditionally calling hooks.
  const leftOpacity = useTransform(x, [0, -100], [0.5, 1]);
  const rightOpacity = useTransform(x, [0, 100], [0.5, 1]);

  const progress = questions.length > 0
    ? (currentIndex / questions.length) * 100
    : 0;

  // Helper function to fetch the class code using the class name
  const fetchClassCode = async (className: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `http://localhost:5051/api/Classes/code?className=${encodeURIComponent(className)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch class code");
      }
      const data = await response.json();
      // Expecting a response: { classCodeId: "BIO101" } (for example)
      return data.classCodeId;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Helper function to fetch True/False questions for a class code
  const fetchTrueFalseQuestions = async (classCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:5051/api/TrueFalse/bycode?classCode=${encodeURIComponent(classCode)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch true/false questions");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIndex(0);
        setUserAnswer(null);
        setShowFeedback(false);
      } else {
        console.error("No true/false questions available for the selected class.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // When className is provided in the URL, fetch the class code then the questions.
  useEffect(() => {
    if (className) {
      fetchClassCode(className).then((classCode) => {
        if (classCode) {
          fetchTrueFalseQuestions(classCode);
        } else {
          console.error("Class code not found for the selected class.");
        }
      });
    }
  }, [className]);

  // Keyboard swipe support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        animate(x, -300, {
          type: "tween",
          duration: 0.2,
          ease: "easeOut",
        }).then(() => {
          setUserAnswer(false);
          setShowFeedback(true);

          setTimeout(() => {
            animate(x, 0, {
              type: "spring",
              stiffness: 200,
              damping: 25,
              velocity: 0,
            });

            setTimeout(() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setUserAnswer(null);
                setShowFeedback(false);
              } else {
                setShowCompletionModal(true);
              }
            }, 800);
          }, 200);
        });
      } else if (e.key === "ArrowRight") {
        animate(x, 300, {
          type: "tween",
          duration: 0.2,
          ease: "easeOut",
        }).then(() => {
          setUserAnswer(true);
          setShowFeedback(true);

          setTimeout(() => {
            animate(x, 0, {
              type: "spring",
              stiffness: 200,
              damping: 25,
              velocity: 0,
            });

            setTimeout(() => {
              if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setUserAnswer(null);
                setShowFeedback(false);
              } else {
                setShowCompletionModal(true);
              }
            }, 800);
          }, 200);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, questions]);

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

    setTimeout(() => {
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
              {className || "True/False Practice"}
            </h1>
            <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
              <span>{questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : "0 / 0"}</span>
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
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {showFeedback && questions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-4xl font-medium text-[#3B4CCA]"
                >
                  {userAnswer === questions[currentIndex].answer
                    ? "Correct!"
                    : "Incorrect"}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question Card */}
            <div className="relative w-[800px] h-[500px]">
              <AnimatePresence mode="wait">
                {questions.length > 0 && (
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
                    <div className="absolute bottom-8 left-0 right-0 flex justify-between px-12">
                      <motion.div style={{ opacity: leftOpacity }}>
                        <div className="flex items-center gap-2 text-red-500">
                          <X className="w-6 h-6" />
                          <span className="font-medium">False</span>
                        </div>
                      </motion.div>
                      <motion.div style={{ opacity: rightOpacity }}>
                        <div className="flex items-center gap-2 text-green-500">
                          <Check className="w-6 h-6" />
                          <span className="font-medium">True</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
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