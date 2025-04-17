"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";
import { generateFlashcards } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useSearchParams } from "next/navigation";


interface Flashcard {
  front: string;
  back: string;
}

// Default sample flashcards (will be replaced by API data)
const sampleFlashcards: Flashcard[] = [
  {
    front: "Cell",
    back: "The basic structural and functional unit of all living organisms",
  },
  {
    front: "Nucleus",
    back: "A membrane-bound organelle that contains genetic material",
  },
  {
    front: "Mitochondria",
    back: "The powerhouse of the cell that produces energy in the form of ATP",
  },
];

export default function FlashcardsPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards);
  const [totalCards, setTotalCards] = useState(sampleFlashcards.length);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle fetch flashcards from API
  const handleGenerateFlashcards = async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Sending request to generate flashcards for topic: ${topic}`);
      const response = await generateFlashcards(topic);
      console.log("Response received:", response);

      // Format the response into flashcards
      // This assumes the API returns flashcards in a specific format
      const formattedFlashcards = Array.isArray(response)
        ? response.map((item: any) => ({
            front: item.question || item.front,
            back: item.answer || item.back,
          }))
        : [];

      if (formattedFlashcards.length > 0) {
        setFlashcards(formattedFlashcards);
        setTotalCards(formattedFlashcards.length);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        // If no flashcards were returned, use the sample ones
        setError(
          "No valid flashcards were generated. Using sample flashcards instead."
        );
        console.error("No valid flashcards in response:", response);
      }
    } catch (err) {
      setError(
        `Error generating flashcards: ${
          err instanceof Error ? err.message : "Failed to fetch"
        }`
      );
      console.error("Error generating flashcards:", err);
    } finally {
      setIsLoading(false);
    }
  };


  // Add this new helper function near the other functions in your file:
  const fetchClassCode = async (className: string): Promise<string | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5051/api/Classes/code?className=${encodeURIComponent(
          className
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch class code");
      }
      const data = await response.json();
      return data.classCodeId;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching class code"
      );
      return null;
    }
  };

  const fetchFlashcardsForClass = async (classCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5051/api/flashcards/bycode?classCode=${encodeURIComponent(
          classCode
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards for the selected class.");
      }
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const fetchedFlashcards = data.map((item: any) => ({
          front: item.question,
          back: item.answer,
        }));

        setFlashcards(fetchedFlashcards);
        setTotalCards(fetchedFlashcards.length);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setError("No flashcards available for the selected class.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  // Instead, use the URL-derived className to call your API
  const searchParams = useSearchParams();
  const className = searchParams.get("class"); // e.g., "Computer Science 101"
  const examId = searchParams.get("examId"); // Get exam ID from the URL

  // Function to fetch flashcards by exam ID
  const fetchFlashcardsByExam = async (examId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5051/api/flashcards/exam/${examId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flashcards for the selected exam.");
      }
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const fetchedFlashcards = data.map((item: any) => ({
          front: item.question,
          back: item.answer,
        }));

        setFlashcards(fetchedFlashcards);
        setTotalCards(fetchedFlashcards.length);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setError("No flashcards available for the selected exam.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  // New useEffect to fetch flashcards based on class name or exam ID
  useEffect(() => {
    // If examId is provided, fetch flashcards by exam ID
    if (examId) {
      fetchFlashcardsByExam(examId);
    }
    // Otherwise use class name to fetch cards
    else if (className) {
      // First, fetch the class code from the API
      fetchClassCode(className).then((classCode) => {
        if (classCode) {
          // Then, using the obtained class code, fetch the flashcards
          fetchFlashcardsForClass(classCode);
        } else {
          setError("Class code not found for the selected class.");
        }
      });
    }
  }, [className, examId]);


  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip keyboard navigation if an input field is focused
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }

      if (e.key === "ArrowLeft") {
        setDirection(-1);
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        setDirection(1);
        handleNext();
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === " "
      ) {
        // Prevent default behavior for space
        e.preventDefault();
        setIsFlipped(!isFlipped);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isFlipped]);

  const handleNext = () => {
    setIsFlipped(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const progress = ((currentIndex + 1) / totalCards) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
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

      {/* Rest of the content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <button
              onClick={() => router.push("/student-dashboard")}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-lg">Flashcards</span>
            </button>
            <button
              onClick={() => router.push("/student-dashboard")}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>
                {flashcards.length > 0
                  ? `${currentIndex + 1} / ${totalCards}`
                  : "No flashcards"}
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#3B4CCA] transition-all duration-300 ease-out"
                style={{
                  width: `${
                    flashcards.length > 0
                      ? ((currentIndex + 1) / totalCards) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {error && <div className="px-4 pb-2 text-red-500 text-sm">{error}</div>}

        {/* Flashcard Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex items-center gap-8">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Flashcard */}
            <div className="perspective-1000">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-[800px] h-[500px] cursor-pointer"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{
                      duration: 0.8,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      mass: 1.2,
                    }}
                    className="w-full h-full preserve-3d"
                    onClick={handleFlip}
                  >
                    <div
                      className={`absolute inset-0 backface-hidden rounded-xl p-12 flex items-center justify-center text-center
                        bg-[#111111] border border-[#222222] w-full h-full`}
                    >
                      <span className="text-4xl font-medium text-white">
                        {flashcards[currentIndex].front}
                      </span>
                    </div>
                    <div
                      className={`absolute inset-0 backface-hidden rounded-xl p-12 flex items-center justify-center text-center
                        bg-[#111111] border border-[#222222] w-full h-full rotate-y-180`}
                    >
                      <span className="text-2xl text-white">
                        {flashcards[currentIndex].back}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
