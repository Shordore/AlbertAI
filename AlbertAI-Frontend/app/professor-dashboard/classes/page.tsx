"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronLeft,
  Copy,
  MoreVertical,
  Eye,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const classes = [
  {
    id: "bio101",
    name: "Biology 101",
    students: 32,
    averageScore: 78,
    status: "Active",
    lastExam: {
      name: "Midterm Exam",
      date: "Mar 15, 2025",
    },
  },
  {
    id: "chem201",
    name: "Chemistry 201",
    students: 28,
    averageScore: 72,
    status: "Active",
    lastExam: {
      name: "Pop Quiz",
      date: "Mar 10, 2025",
    },
  },
  {
    id: "phys301",
    name: "Physics 301",
    students: 24,
    averageScore: 81,
    status: "Active",
    lastExam: {
      name: "Lab Practical",
      date: "Apr 5, 2025",
    },
  },
  {
    id: "hist101",
    name: "World History",
    students: 35,
    averageScore: 68,
    status: "Inactive",
    lastExam: {
      name: "Chapter Quiz",
      date: "Feb 20, 2025",
    },
  },
];

const sortOptions = [
  { label: "Class Name (A-Z)", value: "name-asc" },
  { label: "Class Name (Z-A)", value: "name-desc" },
  { label: "Students (Highest)", value: "students-desc" },
  { label: "Students (Lowest)", value: "students-asc" },
  { label: "Average Score (Highest)", value: "score-desc" },
  { label: "Average Score (Lowest)", value: "score-asc" },
];

export default function Classes() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("name-asc");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [showCourseCode, setShowCourseCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateCourseCode = () => {
    // Generate a random course code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleAddClass = () => {
    // Generate course code after clicking Add Class
    const newCourseCode = generateCourseCode();
    setCourseCode(newCourseCode);
    setShowCourseCode(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(courseCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDone = () => {
    setIsAddClassOpen(false);
    setClassName("");
    setCourseCode("");
    setShowCourseCode(false);
    setIsCopied(false);
  };

  // Filter and sort classes
  const filteredClasses = classes
    .filter((cls) => {
      if (searchQuery) {
        return cls.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "students-asc":
          return a.students - b.students;
        case "students-desc":
          return b.students - a.students;
        case "score-asc":
          return a.averageScore - b.averageScore;
        case "score-desc":
          return b.averageScore - a.averageScore;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => router.push("/professor-dashboard")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Classes</h1>
            <p className="text-sm text-gray-400">
              Manage your classes and view performance metrics
            </p>
          </div>
          <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3B4CCA] text-white hover:bg-[#3343b3] rounded-xl">
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add New Class
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {!showCourseCode
                    ? "Enter your class name to create a new class"
                    : "Your class has been created! Here's your course code:"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {!showCourseCode ? (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="className"
                        className="text-sm font-medium text-white"
                      >
                        Class Name
                      </label>
                      <Input
                        id="className"
                        placeholder="Enter class name..."
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="bg-[#111111] border-[#222222] text-white placeholder-gray-500 focus:border-[#3B4CCA]"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddClassOpen(false)}
                        className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddClass}
                        disabled={!className}
                        className="bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
                      >
                        Add Class
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 rounded-xl bg-[#111111] border border-[#222222] flex flex-col items-center">
                      <p className="text-3xl font-mono font-bold text-white mb-4">
                        {courseCode}
                      </p>
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent border-[#222222] text-white hover:bg-[#222222]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleDone}
                        className="bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
                      >
                        Done
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-2 pl-10 focus:outline-none focus:border-[#3B4CCA] placeholder-gray-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L15.5 15.5M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#222222] text-white border-zinc-800 hover:bg-[#2a2a2a] rounded-xl"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6h18M6 12h12M9 18h6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111111] border border-zinc-800 rounded-xl p-1 min-w-[200px]">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer px-3 py-2"
                        onClick={() => setSelectedSort(option.value)}
                      >
                        <span
                          className={
                            selectedSort === option.value ? "text-white" : ""
                          }
                        >
                          {option.label}
                        </span>
                        {selectedSort === option.value && (
                          <svg
                            className="w-4 h-4 ml-auto"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-6 text-sm font-medium text-gray-400 mb-4">
                <div className="col-span-2">Class Name</div>
                <div>Students</div>
                <div>Avg. Score</div>
                <div>Last Exam</div>
                <div className="text-right">Actions</div>
              </div>

              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="grid grid-cols-6 text-sm py-4 border-t border-[#1F1F1F] group"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <Users className="h-5 w-5 text-white" />
                    <div>
                      <div className="text-white font-medium">{cls.name}</div>
                      <div className="text-xs text-gray-400">{cls.status}</div>
                    </div>
                  </div>
                  <div className="text-white">{cls.students}</div>
                  <div className="text-white">{cls.averageScore}%</div>
                  <div>
                    <div className="text-white">{cls.lastExam.name}</div>
                    <div className="text-xs text-gray-400">
                      {cls.lastExam.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#111111] border border-zinc-800 rounded-xl p-1 min-w-[160px]"
                      >
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-[#222222] focus:bg-[#222222] cursor-pointer px-3 py-2 rounded-lg"
                          onClick={() =>
                            router.push(
                              `/professor-dashboard/classes/${cls.id}`
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-[#222222] focus:bg-[#222222] cursor-pointer px-3 py-2 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                          Delete Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
