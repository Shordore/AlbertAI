"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";
import { generateFlashcards } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      console.log('Response received:', response);
      
      // Format the response into flashcards
      // This assumes the API returns flashcards in a specific format
      const formattedFlashcards = Array.isArray(response) ? response.map((item: any) => ({
        front: item.question || item.front,
        back: item.answer || item.back
      })) : [];
      
      if (formattedFlashcards.length > 0) {
        setFlashcards(formattedFlashcards);
        setTotalCards(formattedFlashcards.length);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        // If no flashcards were returned, use the sample ones
        setError("No valid flashcards were generated. Using sample flashcards instead.");
        console.error("No valid flashcards in response:", response);
      }
    } catch (err) {
      setError(`Error generating flashcards: ${err instanceof Error ? err.message : 'Failed to fetch'}`);
      console.error("Error generating flashcards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip keyboard navigation if an input field is focused
      if (document.activeElement?.tagName === 'INPUT') {
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
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => router.push("/student-dashboard")}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Flashcards</span>
            </button>
            <button
              onClick={() => router.push("/student-dashboard")}
              className="text-zinc-400 hover:text-white transition-colors ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Add Flashcard Generator UI */}
          <div className="px-4 pb-4 flex gap-2">
            <Input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for flashcards..."
              className="flex-1 bg-zinc-900 border-zinc-700 text-white"
              onKeyPress={(e) => e.key === "Enter" && handleGenerateFlashcards()}
            />
            <Button
              onClick={handleGenerateFlashcards}
              className="bg-[#3B4CCA] hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : <Plus className="w-5 h-5" />}
            </Button>
          </div>

          {error && (
            <div className="px-4 pb-2 text-red-500 text-sm">{error}</div>
          )}

          <div className="px-4 pb-4">
            <h1 className="text-2xl font-semibold text-white mb-2">
              {topic ? `Flashcards: ${topic}` : "Sample Flashcards"}
            </h1>
            <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
              <span>
                {flashcards.length > 0 ? `${currentIndex + 1} / ${totalCards}` : "No flashcards"}
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B4CCA] transition-all duration-300 ease-out"
                style={{ width: `${flashcards.length > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

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
