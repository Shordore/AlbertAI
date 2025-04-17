"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, Calendar as CalendarIcon, X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export default function CreateExam() {
  const router = useRouter();
  const [examName, setExamName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState<Date>();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<
    "preparing" | "complete" | null
  >(null);
  const [errors, setErrors] = useState<{
    examName?: string;
    selectedClass?: string;
    date?: string;
    files?: string;
  }>({});
  const [classes, setClasses] = useState<
    Array<{ id: number; code: string; className: string }>
  >([]);
  const [professorId, setProfessorId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the current professor's ID
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
      }/api/professor/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProfessorId(data.id);
        // After getting the professor ID, fetch their classes
        fetchProfessorClasses(data.id, token);
      })
      .catch((err) => console.error("Error fetching professor data:", err));
  }, []);

  const fetchProfessorClasses = (profId: number, token: string) => {
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
      }/api/classes/professor/${profId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClasses(data);
        }
      })
      .catch((err) => console.error("Error fetching professor classes:", err));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (files.length >= 10) {
        alert("You can only upload up to 10 files");
        return;
      }
      setFiles((prev) => [...prev, e.target.files![0]]);
    }
    // Reset the input value to allow uploading the same file again
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!examName.trim()) {
      newErrors.examName = "Exam name is required";
    }

    if (!selectedClass) {
      newErrors.selectedClass = "Please select a class";
    }

    if (!date) {
      newErrors.date = "Please select a date";
    }

    if (files.length === 0) {
      newErrors.files = "Please upload at least one file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoadingPhase("preparing");

    try {
      // Get the auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // First create the exam
      const examResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
        }/api/exam`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            classId: parseInt(selectedClass),
            title: examName,
            date: date?.toISOString(),
          }),
        }
      );

      if (!examResponse.ok) {
        throw new Error("Failed to create exam");
      }

      const examData = await examResponse.json();
      const examId = examData.id;

      // Upload files and process exam content
      if (files.length > 0) {
        // For now we're just simulating the file upload process with a delay
        // In a real implementation, this would upload files to the server
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      setLoadingPhase("complete");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to the newly created exam
      router.push(`/professor-dashboard/exams/${examId}`);
    } catch (error) {
      console.error("Error creating exam:", error);
      setIsLoading(false);
      alert("Failed to create exam. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        {loadingPhase === "preparing" ? (
          <div className="relative flex flex-col items-center">
            {/* Flying papers animation - positioned above text */}
            <div className="relative w-48 h-48 mb-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-14 h-20 bg-white rounded-lg shadow-lg opacity-80 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    animation: `shuffle${i + 1} 2s infinite`,
                    animationDelay: `${i * 0.15}s`,
                    zIndex: 5 - i,
                  }}
                >
                  {/* Paper lines */}
                  <div className="w-10 h-0.5 bg-gray-300 absolute top-4 left-2"></div>
                  <div className="w-8 h-0.5 bg-gray-300 absolute top-6 left-2"></div>
                  <div className="w-9 h-0.5 bg-gray-300 absolute top-8 left-2"></div>
                  <div className="w-7 h-0.5 bg-gray-300 absolute top-10 left-2"></div>
                </div>
              ))}
            </div>

            {/* Loading text - positioned below papers */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Preparing Your Course Content
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-2 h-2 bg-[#3B4CCA] rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#3B4CCA] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#3B4CCA] rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#3B4CCA] rounded-full mx-auto flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Your Questions Have Been Generated!
            </h2>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-3xl p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Create New Exam</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#111111] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Exam Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Exam Name</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm Exam"
                  value={examName}
                  onChange={(e) => {
                    setExamName(e.target.value);
                    setErrors((prev) => ({ ...prev, examName: undefined }));
                  }}
                  className={`w-full bg-[#1F1F1F] border-2 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B4CCA] ${
                    errors.examName ? "border-red-500" : "border-transparent"
                  }`}
                />
                {errors.examName && (
                  <p className="mt-1 text-sm text-red-500">{errors.examName}</p>
                )}
              </div>

              <div>
                <label className="block text-white mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      selectedClass: undefined,
                    }));
                  }}
                  className={`w-full bg-[#1F1F1F] border-2 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B4CCA] ${
                    errors.selectedClass
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                >
                  <option value="">Select a class</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id.toString()}>
                      {classItem.className} ({classItem.code})
                    </option>
                  ))}
                </select>
                {errors.selectedClass && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.selectedClass}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white mb-2">Exam Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        value={date ? format(date, "MM/dd/yyyy") : ""}
                        className={`w-full bg-[#1F1F1F] border-2 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3B4CCA] cursor-pointer ${
                          errors.date ? "border-red-500" : "border-transparent"
                        }`}
                        readOnly
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 border-0 shadow-xl"
                    align="start"
                    sideOffset={8}
                  >
                    <DatePicker
                      selectedDate={date}
                      onDateSelect={(newDate) => {
                        setDate(newDate);
                        setErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#111111] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Upload Course Content
            </h2>

            {files.length > 0 && (
              <div className="mb-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1F1F1F] rounded-lg p-3 text-white"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center ${
                errors.files ? "border-red-500" : "border-[#1F1F1F]"
              }`}
            >
              <input
                type="file"
                onChange={(e) => {
                  handleFileChange(e);
                  setErrors((prev) => ({ ...prev, files: undefined }));
                }}
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-gray-400">
                  Drag and drop your files here, or click to browse
                  <br />
                  <span className="text-sm">
                    Supports PDF, DOCX, TXT (max 10MB)
                    <br />
                    {files.length}/10 files uploaded
                  </span>
                </div>
              </label>
            </div>
            {errors.files && (
              <p className="mt-1 text-sm text-red-500">{errors.files}</p>
            )}

            <Button
              type="button"
              className="w-full mt-4 bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={files.length >= 10}
            >
              Browse Files
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
          >
            Generate Questions
          </Button>
        </form>
      </div>
    </div>
  );
}

// Update the animation styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes shuffle1 {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-80%, -60%) rotate(-12deg); }
  75% { transform: translate(-20%, -45%) rotate(8deg); }
}
@keyframes shuffle2 {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-25%, -65%) rotate(10deg); }
  75% { transform: translate(-75%, -40%) rotate(-8deg); }
}
@keyframes shuffle3 {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-70%, -55%) rotate(-10deg); }
  75% { transform: translate(-30%, -42%) rotate(12deg); }
}
@keyframes shuffle4 {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-85%, -48%) rotate(8deg); }
  75% { transform: translate(-15%, -52%) rotate(-10deg); }
}
@keyframes shuffle5 {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  25% { transform: translate(-20%, -58%) rotate(-8deg); }
  75% { transform: translate(-80%, -45%) rotate(10deg); }
}
`;
document.head.appendChild(styleSheet);
