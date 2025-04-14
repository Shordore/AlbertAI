"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FlashcardQuestion {
  id: string;
  type: "Flashcard";
  question: string;
  answer: string;
}

interface TrueFalseQuestion {
  id: string;
  type: "True/False";
  question: string;
  answer: boolean;
}

interface MultipleChoiceQuestion {
  id: string;
  type: "Multiple Choice";
  question: string;
  options: string[];
  answer: string;
}

type Question = FlashcardQuestion | TrueFalseQuestion | MultipleChoiceQuestion;

// Mock data for the exam
const examData = {
  id: "exam1",
  name: "Final Exam",
  class: "Biology 101",
  status: "Scheduled",
  date: "Apr 20, 2025",
  time: "9:00 AM",
  duration: "120 minutes",
  totalQuestions: 60,
  questions: {
    flashcards: [
      {
        id: "fc1",
        question: "What is photosynthesis?",
        answer:
          "The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.",
      },
      {
        id: "fc2",
        question: "Define cellular respiration.",
        answer:
          "The process by which cells break down glucose and other molecules to generate energy in the form of ATP.",
      },
      {
        id: "fc3",
        question: "What is DNA?",
        answer:
          "Deoxyribonucleic acid, a self-replicating material present in nearly all living organisms as the main constituent of chromosomes.",
      },
    ],
    trueFalse: [
      {
        id: "tf1",
        question: "Photosynthesis occurs in all living organisms.",
        answer: false,
      },
      {
        id: "tf2",
        question: "DNA is a double-helix structure.",
        answer: true,
      },
    ],
    multipleChoice: [
      {
        id: "mc1",
        question: "Which of the following is NOT a part of a cell?",
        options: ["Nucleus", "Mitochondria", "Carburetor", "Golgi Body"],
        answer: 2,
      },
      {
        id: "mc2",
        question: "What is the primary function of mitochondria?",
        options: [
          "Protein synthesis",
          "Energy production",
          "Cell division",
          "Waste removal",
        ],
        answer: 1,
      },
    ],
  },
};

const flashcards = [
  {
    id: "1",
    type: "Flashcard" as const,
    question: "What is photosynthesis?",
    answer:
      "The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.",
  },
  {
    id: "2",
    type: "Flashcard" as const,
    question: "What is cellular respiration?",
    answer:
      "The metabolic process by which cells break down glucose to produce energy in the form of ATP.",
  },
];

const trueFalseQuestions = [
  {
    id: "1",
    type: "True/False" as const,
    question: "Mitochondria is the powerhouse of the cell.",
    answer: true,
  },
  {
    id: "2",
    type: "True/False" as const,
    question: "DNA is a single-stranded molecule.",
    answer: false,
  },
];

const multipleChoiceQuestions = [
  {
    id: "1",
    type: "Multiple Choice" as const,
    question: "Which of the following is NOT a type of RNA?",
    options: ["mRNA", "tRNA", "dRNA", "rRNA"],
    answer: "dRNA",
  },
  {
    id: "2",
    type: "Multiple Choice" as const,
    question: "What is the primary function of the nucleus?",
    options: [
      "Energy production",
      "Protein synthesis",
      "Storing genetic material",
      "Waste removal",
    ],
    answer: "Storing genetic material",
  },
];

export default function ExamDetails() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeQuestionType, setActiveQuestionType] =
    useState<Question["type"]>("Flashcard");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingQuestionType, setEditingQuestionType] = useState<
    Question["type"] | null
  >(null);

  const handleDelete = () => {
    // Add delete logic here
    console.log("Deleting exam:", examData.id);
    setDeleteDialogOpen(false);
    router.push("/professor-dashboard");
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setEditingQuestionType(question.type);
    setEditDialogOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    // Add save logic here based on question type
    console.log("Saving question:", editingQuestion);
    setEditDialogOpen(false);
    setEditingQuestion(null);
    setEditingQuestionType(null);
  };

  const handleDeleteQuestion = () => {
    if (!editingQuestion) return;

    // Add delete logic here based on question type
    console.log("Deleting question:", editingQuestion);
    setEditDialogOpen(false);
    setEditingQuestion(null);
    setEditingQuestionType(null);
  };

  const handleQuestionTypeChange = (type: Question["type"]) => {
    setActiveQuestionType(type);
  };

  const renderEditDialog = () => {
    if (!editingQuestion || !editingQuestionType) return null;

    return (
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Edit {editingQuestionType}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            {editingQuestionType === "Flashcard" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Question
                  </label>
                  <textarea
                    className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B4CCA]"
                    rows={3}
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      } as FlashcardQuestion)
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Answer
                  </label>
                  <textarea
                    className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B4CCA]"
                    rows={3}
                    value={editingQuestion.answer}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        answer: e.target.value,
                      } as FlashcardQuestion)
                    }
                  />
                </div>
              </>
            )}

            {editingQuestionType === "True/False" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Statement
                  </label>
                  <textarea
                    className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B4CCA]"
                    rows={3}
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      } as TrueFalseQuestion)
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Correct Answer
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#3B4CCA] bg-[#111111] border-[#222222]"
                        name="answer"
                        checked={editingQuestion.answer === true}
                        onChange={() =>
                          setEditingQuestion({
                            ...editingQuestion,
                            answer: true,
                          } as TrueFalseQuestion)
                        }
                      />
                      <span className="ml-2 text-white">True</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-[#3B4CCA] bg-[#111111] border-[#222222]"
                        name="answer"
                        checked={editingQuestion.answer === false}
                        onChange={() =>
                          setEditingQuestion({
                            ...editingQuestion,
                            answer: false,
                          } as TrueFalseQuestion)
                        }
                      />
                      <span className="ml-2 text-white">False</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {editingQuestionType === "Multiple Choice" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Question
                  </label>
                  <textarea
                    className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-3 focus:outline-none focus:border-[#3B4CCA]"
                    rows={3}
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      } as MultipleChoiceQuestion)
                    }
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">
                    Options
                  </label>
                  {(editingQuestion as MultipleChoiceQuestion).options.map(
                    (option, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          className="form-radio text-[#3B4CCA] bg-[#111111] border-[#222222]"
                          name="correctAnswer"
                          checked={editingQuestion.answer === option}
                          onChange={() =>
                            setEditingQuestion({
                              ...editingQuestion,
                              answer: option,
                            } as MultipleChoiceQuestion)
                          }
                        />
                        <input
                          type="text"
                          className="flex-1 bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-2 focus:outline-none focus:border-[#3B4CCA]"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [
                              ...(editingQuestion as MultipleChoiceQuestion)
                                .options,
                            ];
                            newOptions[index] = e.target.value;
                            setEditingQuestion({
                              ...editingQuestion,
                              options: newOptions,
                            } as MultipleChoiceQuestion);
                          }}
                        />
                        <Button
                          variant="ghost"
                          className="px-2 text-gray-400 hover:text-red-500"
                          onClick={() => {
                            const newOptions = (
                              editingQuestion as MultipleChoiceQuestion
                            ).options.filter((_, i) => i !== index);
                            setEditingQuestion({
                              ...editingQuestion,
                              options: newOptions,
                            } as MultipleChoiceQuestion);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-[#111111] text-white border-[#222222] hover:bg-[#222222]"
                    onClick={() => {
                      setEditingQuestion({
                        ...editingQuestion,
                        options: [
                          ...(editingQuestion as MultipleChoiceQuestion)
                            .options,
                          "",
                        ],
                      } as MultipleChoiceQuestion);
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <Button
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleDeleteQuestion}
              >
                Delete Question
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveQuestion}
                  className="bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderQuestions = () => {
    switch (activeQuestionType) {
      case "Flashcard":
        return flashcards.map((question) => (
          <div
            key={question.id}
            className="bg-[#111111] border border-[#222222] rounded-xl p-6 mb-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">
                  {question.question}
                </h3>
                <p className="text-gray-400">{question.answer}</p>
              </div>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => handleEditQuestion(question)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ));

      case "True/False":
        return trueFalseQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-[#111111] border border-[#222222] rounded-xl p-6 mb-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">
                  {question.question}
                </h3>
                <p className="text-gray-400">
                  Answer: {question.answer ? "True" : "False"}
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => handleEditQuestion(question)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ));

      case "Multiple Choice":
        return multipleChoiceQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-[#111111] border border-[#222222] rounded-xl p-6 mb-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">
                  {question.question}
                </h3>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        option === question.answer
                          ? "text-[#3B4CCA]"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border ${
                          option === question.answer
                            ? "border-[#3B4CCA] bg-[#3B4CCA]"
                            : "border-gray-400"
                        }`}
                      />
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => handleEditQuestion(question)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => router.push("/professor-dashboard")}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{examData.name}</h1>
              <p className="text-gray-400">{examData.class}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-[#1F1F1F] text-red-500 border-0 hover:bg-[#2a2a2a] hover:text-red-400 rounded-xl"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Exam
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#CD7F32] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2 text-white/80">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path
                  d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Date & Time
            </div>
            <div className="text-4xl font-bold text-white">{examData.date}</div>
            <div className="text-sm text-white/80">{examData.time}</div>
          </div>

          <div className="bg-[#3B4CCA] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2 text-white/80">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path
                  d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Questions
            </div>
            <div className="text-4xl font-bold text-white">
              {examData.totalQuestions}
            </div>
            <div className="text-sm text-white/80">
              Flashcards: {examData.questions.flashcards.length}
              <br />
              True/False: {examData.questions.trueFalse.length}
              <br />
              Multiple Choice: {examData.questions.multipleChoice.length}
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] rounded-xl border border-[#1F1F1F]">
          <div className="p-6">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleQuestionTypeChange("Flashcard")}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      activeQuestionType === "Flashcard"
                        ? "bg-[#3B4CCA] text-white"
                        : "bg-[#1F1F1F] text-white hover:bg-[#2a2a2a]"
                    }`}
                  >
                    Flashcards {examData.questions.flashcards.length}
                  </button>
                  <button
                    onClick={() => handleQuestionTypeChange("True/False")}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      activeQuestionType === "True/False"
                        ? "bg-[#3B4CCA] text-white"
                        : "bg-[#1F1F1F] text-white hover:bg-[#2a2a2a]"
                    }`}
                  >
                    True/False {examData.questions.trueFalse.length}
                  </button>
                  <button
                    onClick={() => handleQuestionTypeChange("Multiple Choice")}
                    className={`rounded-lg px-3 py-1 text-sm ${
                      activeQuestionType === "Multiple Choice"
                        ? "bg-[#3B4CCA] text-white"
                        : "bg-[#1F1F1F] text-white hover:bg-[#2a2a2a]"
                    }`}
                  >
                    Multiple Choice {examData.questions.multipleChoice.length}
                  </button>
                </div>

                <div className="space-y-4">{renderQuestions()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderEditDialog()}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Delete Exam
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this exam? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
