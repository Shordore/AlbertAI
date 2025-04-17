"use client";

import { CustomCalendar } from "@/components/ui/custom-calendar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AddClassDialog } from "@/components/AddClassDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  BookOpen,
  ClipboardCheck,
  ScrollText,
  ChevronDown,
  Plus,
  CheckSquare,
  ListChecks,
  ChevronUp,
  Settings,
  LogOut,
  Bot,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getFlashcardsCount,
  getTrueFalseCount,
  getMultipleChoiceCount,
  getFlashcardsCountByExam,
  getTrueFalseCountByExam,
  getMultipleChoiceCountByExam,
} from "@/lib/api";

const performanceData = [
  {
    name: "Jan 20",
    flashcards: 70,
    trueFalse: 55,
    multipleChoice: 60,
    practiceTests: 50,
  },
  {
    name: "Jan 21",
    flashcards: 72,
    trueFalse: 58,
    multipleChoice: 65,
    practiceTests: 55,
  },
  {
    name: "Jan 22",
    flashcards: 75,
    trueFalse: 62,
    multipleChoice: 68,
    practiceTests: 60,
  },
  {
    name: "Jan 23",
    flashcards: 78,
    trueFalse: 65,
    multipleChoice: 72,
    practiceTests: 65,
  },
  {
    name: "Jan 24",
    flashcards: 82,
    trueFalse: 70,
    multipleChoice: 75,
    practiceTests: 70,
  },
  {
    name: "Jan 25",
    flashcards: 85,
    trueFalse: 75,
    multipleChoice: 78,
    practiceTests: 72,
  },
  {
    name: "Jan 26",
    flashcards: 88,
    trueFalse: 80,
    multipleChoice: 82,
    practiceTests: 75,
  },
];

const upcomingTests = [
  {
    title: "Midterm Exam",
    date: "Mar 15, 2025 - 10:00 AM",
    course: "Biology 101",
    icon: <ScrollText className="w-5 h-5 text-white" />,
  },
  {
    title: "Pop Quiz",
    date: "Mar 10, 2025 - 2:00 PM",
    course: "Chemistry 201",
    icon: <BookOpen className="w-5 h-5 text-white" />,
  },
  {
    title: "Final Exam",
    date: "Apr 20, 2025 - 9:00 AM",
    course: "Physics 301",
    icon: <ScrollText className="w-5 h-5 text-white" />,
  },
  {
    title: "Chapter 5 Quiz",
    date: "Mar 18, 2025 - 11:30 AM",
    course: "Biology 101",
    icon: <BookOpen className="w-5 h-5 text-white" />,
  },
  {
    title: "Lab Practical",
    date: "Apr 5, 2025 - 3:00 PM",
    course: "Chemistry 201",
    icon: <ClipboardCheck className="w-5 h-5 text-white" />,
  },
];

const studyHistory = [
  {
    name: "Biology Chapter 1",
    lastStudied: "02/22/25 10:00 PM",
    score: "85%",
    flashcards: 25,
    trueFalse: 15,
    multipleChoice: 20,
    status: "Pass",
  },
  {
    name: "Physics Laws",
    lastStudied: "02/21/25 5:00 PM",
    score: "70%",
    flashcards: 30,
    trueFalse: 10,
    multipleChoice: 25,
    status: "Pass",
  },
  {
    name: "World History",
    lastStudied: "02/20/25 8:00 PM",
    score: "40%",
    flashcards: 20,
    trueFalse: 5,
    multipleChoice: 15,
    status: "Fail",
  },
];

const notifications = [
  {
    subject: "New Quiz Available",
    sender: "Biology 101",
    message: "A new practice quiz for Chapter 5 is now available.",
  },
  {
    subject: "Study Reminder",
    sender: "Albert AI",
    message: "You haven't studied Physics in 3 days. Time to review!",
  },
  {
    subject: "Test Coming Up",
    sender: "Chemistry 201",
    message: "Don't forget about your upcoming test on Organic Chemistry.",
  },
];

interface StudyHistoryItem {
  name: string;
  lastStudied: string;
  score: string;
  flashcards: number;
  trueFalse: number;
  multipleChoice: number;
  status: string;
}

interface SortConfig {
  key: "lastStudied" | "score" | "status";
  direction: "asc" | "desc";
}

interface SortButtonProps {
  columnKey: SortConfig["key"];
  label: string;
}

export default function StudentDashboardPage() {
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "lastStudied",
    direction: "desc",
  });
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    classes: string[];
  } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [exams, setExams] = useState<Array<{ title: string; id: number }>>([]);
  const [selectedExam, setSelectedExam] = useState<[string, number] | null>(
    null
  );

  // Add state for question counts
  const [questionCounts, setQuestionCounts] = useState({
    flashcards: 0,
    trueFalse: 0,
    multipleChoice: 0,
    practiceTests: 0, // Changed from 12 to 0
  });

  // Function to fetch question counts
  const fetchQuestionCounts = async (classCode: string) => {
    try {
      // Fetch counts in parallel
      const [flashcardsCount, trueFalseCount, multipleChoiceCount] =
        await Promise.all([
          getFlashcardsCount(classCode),
          getTrueFalseCount(classCode),
          getMultipleChoiceCount(classCode),
        ]);

      setQuestionCounts({
        flashcards: flashcardsCount,
        trueFalse: trueFalseCount,
        multipleChoice: multipleChoiceCount,
        practiceTests: 0, // Changed from 12 to 0
      });
    } catch (error) {
      console.error("Error fetching question counts:", error);
    }
  };

  // Function to fetch question counts for an exam
  const fetchQuestionCountsByExam = async (examId: number) => {
    try {
      // Fetch counts in parallel
      const [flashcardsCount, trueFalseCount, multipleChoiceCount] =
        await Promise.all([
          getFlashcardsCountByExam(examId),
          getTrueFalseCountByExam(examId),
          getMultipleChoiceCountByExam(examId),
        ]);

      setQuestionCounts({
        flashcards: flashcardsCount,
        trueFalse: trueFalseCount,
        multipleChoice: multipleChoiceCount,
        practiceTests: 0,
      });
    } catch (error) {
      console.error("Error fetching question counts by exam:", error);
    }
  };

  // Add class code state
  const [currentClassCode, setCurrentClassCode] = useState<string | null>(null);

  // Helper function to fetch class code
  const fetchClassCode = async (className: string) => {
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
    } catch (error) {
      console.error("Error fetching class code:", error);
      return null;
    }
  };

  // Update useEffect to handle both class code and exam selection
  useEffect(() => {
    if (selectedCourse) {
      fetchClassCode(selectedCourse).then((classCode) => {
        if (classCode) {
          setCurrentClassCode(classCode);
          // If an exam is selected, fetch counts for that exam
          if (selectedExam) {
            fetchQuestionCountsByExam(selectedExam[1]);
          } else {
            // Otherwise fetch counts for the whole class
            fetchQuestionCounts(classCode);
          }
        }
      });
    }
  }, [selectedCourse, selectedExam]);

  useEffect(() => {
    if (
      currentUser &&
      currentUser.classes &&
      currentUser.classes.length > 0 &&
      !selectedCourse
    ) {
      setSelectedCourse(currentUser.classes[0]);
    }
  }, [currentUser, selectedCourse]);

  useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      router.push("/sign-in");
      return;
    }

    fetch(`${API_URL}/Account/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        console.log("User data received:", data);
        setCurrentUser(data);
        if (data.classes && data.classes.length > 0 && !selectedCourse) {
          setSelectedCourse(data.classes[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        if (err.message === "Failed to fetch user data") {
          router.push("/sign-in");
        }
      });
  }, []);

  const fetchExamsForClass = async (className: string) => {
    try {
      const response = await fetch(
        `http://localhost:5051/api/Exam/byclassname?className=${encodeURIComponent(
          className
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exams");
      }
      const data = await response.json();
      setExams(data);
      if (data.length > 0) {
        setSelectedExam([data[0].title, data[0].id]);
      } else {
        setSelectedExam(null);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExams([]);
      setSelectedExam(null);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchExamsForClass(selectedCourse);
    }
  }, [selectedCourse]);

  function getInitials(fullName?: string): string {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 0) return "";
    // Take the first character of the first word.
    const firstInitial = parts[0].charAt(0).toUpperCase();
    // If there's more than one word, take the first character of the last word.
    const lastInitial =
      parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  }

  const sortedStudyHistory = [...studyHistory].sort(
    (a: StudyHistoryItem, b: StudyHistoryItem) => {
      if (sortConfig.key === "score") {
        const scoreA = parseInt(a.score);
        const scoreB = parseInt(b.score);
        return sortConfig.direction === "asc"
          ? scoreA - scoreB
          : scoreB - scoreA;
      }
      if (sortConfig.key === "lastStudied") {
        const dateA = new Date(a.lastStudied).getTime();
        const dateB = new Date(b.lastStudied).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.key === "status") {
        return sortConfig.direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    }
  );

  const requestSort = (key: SortConfig["key"]) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const SortButton = ({ columnKey, label }: SortButtonProps) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <button
        onClick={() => requestSort(columnKey)}
        className="flex items-center gap-1 hover:text-white transition-colors"
      >
        {label}
        <span className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              isActive && sortConfig.direction === "asc"
                ? "text-white"
                : "text-gray-500"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 ${
              isActive && sortConfig.direction === "desc"
                ? "text-white"
                : "text-gray-500"
            }`}
          />
        </span>
      </button>
    );
  };

  const handleSignOut = () => {
    // Add any sign out logic here (e.g., clearing tokens, state, etc.)
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-96 border-r border-zinc-800 min-h-screen">
          {/* Profile Section */}
          <div className="p-4 flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-black font-medium text-lg">
                      {getInitials(currentUser?.name)}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {currentUser?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 bg-[#111111] border border-[#222222] rounded-xl p-1"
              >
                <DropdownMenuItem className="flex items-center gap-2 p-3 text-white hover:text-white focus:text-white hover:bg-[#222222] focus:bg-[#222222] rounded-lg cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 p-3 text-white hover:text-white focus:text-white hover:bg-[#222222] focus:bg-[#222222] rounded-lg cursor-pointer"
                  onSelect={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative focus:outline-none">
                    <Bell className="w-6 h-6 text-zinc-400 hover:text-zinc-300" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">
                        {notifications.length}
                      </span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-[#111111] border border-[#222222] rounded-xl"
                >
                  {notifications.map((notification, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="flex flex-col items-start p-4 hover:bg-white/5 focus:bg-white/5 rounded-lg m-1"
                    >
                      <div className="font-semibold text-white">
                        {notification.subject}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {notification.sender}
                      </div>
                      <div className="text-sm text-zinc-300">
                        {notification.message}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-6">
            {/* Calendar */}
            <div className="mb-6">
              <CustomCalendar />
            </div>

            {/* Upcoming Tests */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-white">
                Upcoming Tests & Quizzes
              </h3>
              <div className="space-y-3">
                {upcomingTests.map((test, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-[8px] bg-[#111111] border border-[#222222]"
                  >
                    {test.icon}
                    <div>
                      <h4 className="font-medium text-white">{test.title}</h4>
                      <p className="text-sm text-zinc-400">{test.date}</p>
                      <p className="text-sm text-zinc-400">{test.course}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Navbar */}
          <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
            <Bot className="w-8 h-8 text-[#3B4CCA]" />
            <span className="text-xl font-semibold text-white">AlbertAI</span>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <DropdownMenu>
                  <div className="w-full">
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-full p-6 text-left bg-gradient-to-br from-[#3B4CCA] to-[#1E3A8A] hover:from-[#3B4CCA] hover:to-[#1E3A8A] hover:shadow-xl hover:scale-[1.02] rounded-xl transition-all duration-300 group relative"
                      >
                        <div className="flex items-center space-x-4">
                          <BookOpen className="h-8 w-8 text-blue-200" />
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {selectedCourse ||
                                (!currentUser?.classes ||
                                currentUser.classes.length === 0
                                  ? "Not Enrolled"
                                  : currentUser?.classes[0])}
                            </h3>
                            <p className="text-blue-200">Current Course</p>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-blue-200 absolute top-1/2 right-6 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden"
                    >
                      <AnimatePresence>
                        {currentUser?.classes?.map((course, index) => (
                          <motion.div
                            key={course}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.05,
                            }}
                          >
                            <DropdownMenuItem
                              onClick={() => setSelectedCourse(course)}
                              className="text-white hover:text-white focus:text-white hover:bg-[#3B4CCA]/20 focus:bg-[#3B4CCA]/20 rounded-xl m-1"
                            >
                              {course}
                            </DropdownMenuItem>
                          </motion.div>
                        ))}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, delay: 0.15 }}
                        >
                          <DropdownMenuItem
                            className="text-white hover:text-white focus:text-white hover:bg-[#3B4CCA]/20 focus:bg-[#3B4CCA]/20 rounded-xl m-1"
                            onSelect={() => setIsAddClassDialogOpen(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Add Class</span>
                          </DropdownMenuItem>
                        </motion.div>
                      </AnimatePresence>
                    </DropdownMenuContent>
                  </div>
                </DropdownMenu>
              </div>
              <div className="flex-1">
                <DropdownMenu>
                  <div className="w-full">
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-full p-6 text-left bg-gradient-to-br from-[#FF8C00] to-[#FF4500] hover:from-[#FF8C00] hover:to-[#FF4500] hover:shadow-xl hover:scale-[1.02] rounded-xl transition-all duration-300 group relative"
                      >
                        <div className="flex items-center space-x-4">
                          <ClipboardCheck className="h-8 w-8 text-purple-200" />
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {selectedExam ? selectedExam[0] : "No Exams"}
                            </h3>
                            <p className="text-purple-200">Current Focus</p>
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5 text-purple-200 absolute top-1/2 right-6 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden"
                    >
                      <AnimatePresence>
                        {exams.map((exam, index) => (
                          <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.05,
                            }}
                          >
                            <DropdownMenuItem
                              className="text-white hover:text-white focus:text-white hover:bg-[#FF8C00]/20 focus:bg-[#FF8C00]/20 rounded-xl m-1"
                              onClick={() =>
                                setSelectedExam([exam.title, exam.id])
                              }
                            >
                              {exam.title}
                            </DropdownMenuItem>
                          </motion.div>
                        ))}
                        {exams.length === 0 && (
                          <DropdownMenuItem className="text-gray-400 hover:text-gray-400 focus:text-gray-400 rounded-xl m-1 cursor-default">
                            No exams available
                          </DropdownMenuItem>
                        )}
                      </AnimatePresence>
                    </DropdownMenuContent>
                  </div>
                </DropdownMenu>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card
                className="bg-[#111111] border-[#222222] hover:bg-white hover:text-black transition-colors cursor-pointer group rounded-xl"
                onClick={() => {
                  if (selectedCourse) {
                    const url = `/student-dashboard/flashcards?class=${encodeURIComponent(
                      selectedCourse
                    )}`;
                    const urlWithExam = selectedExam
                      ? `${url}&examId=${selectedExam[1]}`
                      : url;
                    router.push(urlWithExam);
                  } else {
                    router.push(`/student-dashboard/flashcards`);
                  }
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-black">
                    Flashcards
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-white group-hover:text-black group-hover:h-6 group-hover:w-6 transition-all" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-white group-hover:text-black">
                    {questionCounts.flashcards}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-[#111111] border-[#222222] hover:bg-white hover:text-black transition-colors cursor-pointer group rounded-xl"
                onClick={() => {
                  if (selectedCourse) {
                    const url = `/student-dashboard/true-false?class=${encodeURIComponent(
                      selectedCourse
                    )}`;
                    const urlWithExam = selectedExam
                      ? `${url}&examId=${selectedExam[1]}`
                      : url;
                    router.push(urlWithExam);
                  } else {
                    router.push(`/student-dashboard/true-false`);
                  }
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-black">
                    True/False Questions
                  </CardTitle>
                  <CheckSquare className="h-4 w-4 text-white group-hover:text-black group-hover:h-6 group-hover:w-6 transition-all" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-white group-hover:text-black">
                    {questionCounts.trueFalse}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-[#111111] border-[#222222] hover:bg-white hover:text-black transition-colors cursor-pointer group rounded-xl"
                onClick={() => {
                  if (selectedCourse) {
                    const url = `/student-dashboard/multiple-choice?class=${encodeURIComponent(
                      selectedCourse
                    )}`;
                    const urlWithExam = selectedExam
                      ? `${url}&examId=${selectedExam[1]}`
                      : url;
                    router.push(urlWithExam);
                  } else {
                    router.push(`/student-dashboard/multiple-choice`);
                  }
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-black">
                    Multiple Choice
                  </CardTitle>
                  <ListChecks className="h-4 w-4 text-white group-hover:text-black group-hover:h-6 group-hover:w-6 transition-all" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-white group-hover:text-black">
                    {questionCounts.multipleChoice}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-[#111111] border-[#222222] hover:bg-white hover:text-black transition-colors cursor-pointer group rounded-xl"
                onClick={() => router.push("/student-dashboard/practice-test")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-black">
                    Practice Tests
                  </CardTitle>
                  <ClipboardCheck className="h-4 w-4 text-white group-hover:text-black group-hover:h-6 group-hover:w-6 transition-all" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-white group-hover:text-black">
                    {questionCounts.practiceTests}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart and Study Progress */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Performance Chart */}
              <Card className="col-span-2 p-6 bg-[#111111] border border-[#222222] rounded-xl hover:bg-[#191919] transition-colors duration-200">
                <h3 className="text-lg font-medium text-white mb-8">
                  Performance Over Time
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#222222"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#666666"
                        tick={{ fill: "#666666", fontSize: 12 }}
                        axisLine={{ stroke: "#222222" }}
                      />
                      <YAxis
                        stroke="#666666"
                        tick={{ fill: "#666666", fontSize: 12 }}
                        axisLine={{ stroke: "#222222" }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111111",
                          border: "1px solid #222222",
                          borderRadius: "8px",
                          color: "#666666",
                          fontSize: "12px",
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                        labelStyle={{ color: "#666666" }}
                        cursor={{ stroke: "#333333", strokeWidth: 1 }}
                      />
                      <Line
                        type="monotone"
                        name="Flashcards"
                        dataKey="flashcards"
                        stroke="#3B4CCA"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3B4CCA", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#3B4CCA", strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        name="True/False"
                        dataKey="trueFalse"
                        stroke="#1E3A8A"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#1E3A8A", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#1E3A8A", strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        name="Multiple Choice"
                        dataKey="multipleChoice"
                        stroke="#FF8C00"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#FF8C00", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#FF8C00", strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        name="Practice Tests"
                        dataKey="practiceTests"
                        stroke="#FF4500"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#FF4500", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#FF4500", strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Study Progress */}
              <Card className="p-6 bg-[#111111] border border-[#222222] rounded-xl">
                <h3 className="text-lg font-medium text-white mb-8">
                  Study Progress
                </h3>
                <div className="flex flex-col items-center justify-between h-[300px]">
                  <div className="relative w-64 h-64">
                    <svg
                      viewBox="0 0 100 100"
                      className="transform -rotate-90 w-full h-full"
                    >
                      <defs>
                        <linearGradient
                          id="masteredGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" style={{ stopColor: "#3B4CCA" }} />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#1E3A8A" }}
                          />
                        </linearGradient>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" style={{ stopColor: "#FF8C00" }} />
                          <stop
                            offset="100%"
                            style={{ stopColor: "#FF4500" }}
                          />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#222222"
                        strokeWidth="12"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#masteredGradient)"
                        strokeWidth="12"
                        strokeDasharray={`${75 * 2.51} ${100 * 2.51}`}
                        className="transition-all duration-1000 ease-in-out"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="12"
                        strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
                        strokeDashoffset={`${-75 * 2.51}`}
                        className="transition-all duration-1000 ease-in-out"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-4xl font-bold text-white">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-8">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#3B4CCA]"></div>
                      <span className="text-sm text-zinc-400">Mastered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF8C00]"></div>
                      <span className="text-sm text-zinc-400">In Progress</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Study History */}
            <Card className="p-4 bg-[#111111] border border-[#222222] rounded-xl">
              <h3 className="text-lg font-medium mb-4 text-white">
                Study History
              </h3>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="bg-[#111111]">
                      Study Set Name
                    </TableHead>
                    <TableHead className="bg-[#111111]">
                      <SortButton
                        columnKey="lastStudied"
                        label="Last Studied"
                      />
                    </TableHead>
                    <TableHead className="bg-[#111111]">
                      <SortButton columnKey="score" label="Score" />
                    </TableHead>
                    <TableHead className="bg-[#111111]">
                      Flashcards Reviewed
                    </TableHead>
                    <TableHead className="bg-[#111111]">
                      True/False Reviewed
                    </TableHead>
                    <TableHead className="bg-[#111111]">
                      Multiple Choice Reviewed
                    </TableHead>
                    <TableHead className="bg-[#111111]">
                      <SortButton columnKey="status" label="Status" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudyHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-white">{item.name}</TableCell>
                      <TableCell className="text-white">
                        {item.lastStudied}
                      </TableCell>
                      <TableCell className="text-white">{item.score}</TableCell>
                      <TableCell className="text-white">
                        {item.flashcards}
                      </TableCell>
                      <TableCell className="text-white">
                        {item.trueFalse}
                      </TableCell>
                      <TableCell className="text-white">
                        {item.multipleChoice}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Pass"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>

      <AddClassDialog
        open={isAddClassDialogOpen}
        onOpenChange={setIsAddClassDialogOpen}
      />
    </div>
  );
}
