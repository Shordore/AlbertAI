"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Send,
  Plus,
  ChevronDown,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NotificationDialog } from "@/components/notifications/notification-dialog";

interface Student {
  initials: string;
  name: string;
  email: string;
  averageScore: string;
  lastActive: string;
}

const performanceData = [
  { date: "Jan 1", score: 82 },
  { date: "Jan 10", score: 83 },
  { date: "Jan 20", score: 85 },
  { date: "Jan 31", score: 87 },
  { date: "Feb 10", score: 88 },
  { date: "Feb 22", score: 89 },
  { date: "Mar 5", score: 90 },
  { date: "Mar 15", score: 92 },
  { date: "Mar 25", score: 93 },
  { date: "Mar 31", score: 94 },
  { date: "Apr 7", score: 96 },
];

const students = [
  {
    initials: "AJ",
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    averageScore: "82%",
    lastActive: "Apr 12, 2025",
  },
  {
    initials: "JS",
    name: "Jamie Smith",
    email: "jamie.smith@university.edu",
    averageScore: "78%",
    lastActive: "Apr 11, 2025",
  },
  {
    initials: "TW",
    name: "Taylor Wilson",
    email: "taylor.wilson@university.edu",
    averageScore: "91%",
    lastActive: "Apr 13, 2025",
  },
  {
    initials: "ML",
    name: "Morgan Lee",
    email: "morgan.lee@university.edu",
    averageScore: "65%",
    lastActive: "Apr 10, 2025",
  },
];

const exams = [
  {
    id: "final-2025",
    name: "Final Exam",
    date: "Apr 20, 2025",
    questions: 50,
    averageScore: "-",
    status: "Scheduled",
  },
  {
    id: "midterm-2025",
    name: "Midterm Exam",
    date: "Mar 15, 2025",
    questions: 30,
    averageScore: "78%",
    status: "Completed",
  },
];

const sortOptions = [
  { label: "Exam Name (A-Z)", value: "name-asc" },
  { label: "Exam Name (Z-A)", value: "name-desc" },
  { label: "Date (Newest)", value: "date-desc" },
  { label: "Date (Oldest)", value: "date-asc" },
];

interface Exam {
  id: string;
  name: string;
  date: string;
  questions: number;
  averageScore: string;
  status: string;
}

export default function ClassDetails() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Performance");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1 Month");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSort, setSelectedSort] = useState("date-desc");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [deleteExamId, setDeleteExamId] = useState<string | null>(null);
  const [isDeleteExamDialogOpen, setIsDeleteExamDialogOpen] = useState(false);
  const examToDelete = exams.find((e) => e.id === deleteExamId);

  const handleDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = () => {
    // Add actual delete logic here
    console.log("Deleting student:", studentToDelete);
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const sortedExams = [...exams].sort((a, b) => {
    switch (selectedSort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return 0;
    }
  });

  const filteredExams = sortedExams.filter((exam) =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredPerformanceData = () => {
    const now = new Date("2025-04-07"); // Using the last date in our dataset as reference
    const msPerDay = 24 * 60 * 60 * 1000;

    let daysToShow;
    switch (selectedTimeframe) {
      case "1 Month":
        daysToShow = 30;
        break;
      case "3 Months":
        daysToShow = 90;
        break;
      case "6 Months":
        daysToShow = 180;
        break;
      case "1 Year":
        daysToShow = 365;
        break;
      default:
        daysToShow = 30;
    }

    return performanceData.filter((item) => {
      const itemDate = new Date(item.date + ", 2025");
      const diffDays = Math.ceil(
        (now.getTime() - itemDate.getTime()) / msPerDay
      );
      return diffDays <= daysToShow;
    });
  };

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

        <h1 className="text-3xl font-bold text-white mb-6">Biology 101</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#3B4CCA] rounded-xl p-6 text-white">
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
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Students
            </div>
            <div className="text-4xl font-bold">32</div>
            <div className="text-sm text-white/80">Enrolled students</div>
          </div>

          <div className="bg-[#D97706] rounded-xl p-6 text-white">
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
                  d="M16 8V16M12 11V16M8 14V16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Class Preparedness
            </div>
            <div className="text-4xl font-bold">78%</div>
            <div className="text-sm text-white/80">For upcoming exam</div>
          </div>

          <div className="bg-[#1F2937] rounded-xl p-6 text-white">
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
              Next Exam
            </div>
            <div className="text-4xl font-bold">Apr 20, 2025</div>
            <div className="text-sm text-white/80">Final Exam</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">
              Class Overview
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                onClick={() => setIsNotificationDialogOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              <Button
                className="bg-[#3B4CCA] text-white hover:bg-[#3343b3] rounded-xl"
                onClick={() => router.push("/professor-dashboard/exams/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exam
              </Button>
            </div>
          </div>
          <p className="text-gray-400">
            Introduction to the principles of biology, including cell structure,
            genetics, and evolution.
          </p>
        </div>

        <div className="mb-6">
          <div className="border border-[#1F1F1F] rounded-xl overflow-hidden">
            <div className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "Performance"
                    ? "bg-white/10 text-white border-b-2 border-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("Performance")}
              >
                Performance
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "Students"
                    ? "bg-white/10 text-white border-b-2 border-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("Students")}
              >
                Students
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "Exams"
                    ? "bg-white/10 text-white border-b-2 border-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("Exams")}
              >
                Exams
              </button>
            </div>

            <div className="p-6 bg-[#0A0A0A]">
              {activeTab === "Performance" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Performance Over Time
                      </h3>
                      <p className="text-gray-400">
                        Average scores across all students over time
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mb-6">
                    <Button
                      variant={
                        selectedTimeframe === "1 Month" ? "outline" : "ghost"
                      }
                      className={
                        selectedTimeframe === "1 Month"
                          ? "bg-[#222222] text-white border-none hover:bg-[#2a2a2a]"
                          : "text-gray-400 hover:text-white hover:bg-transparent"
                      }
                      onClick={() => setSelectedTimeframe("1 Month")}
                    >
                      1 Month
                    </Button>
                    <Button
                      variant={
                        selectedTimeframe === "3 Months" ? "outline" : "ghost"
                      }
                      className={
                        selectedTimeframe === "3 Months"
                          ? "bg-[#222222] text-white border-none hover:bg-[#2a2a2a]"
                          : "text-gray-400 hover:text-white hover:bg-transparent"
                      }
                      onClick={() => setSelectedTimeframe("3 Months")}
                    >
                      3 Months
                    </Button>
                    <Button
                      variant={
                        selectedTimeframe === "6 Months" ? "outline" : "ghost"
                      }
                      className={
                        selectedTimeframe === "6 Months"
                          ? "bg-[#222222] text-white border-none hover:bg-[#2a2a2a]"
                          : "text-gray-400 hover:text-white hover:bg-transparent"
                      }
                      onClick={() => setSelectedTimeframe("6 Months")}
                    >
                      6 Months
                    </Button>
                    <Button
                      variant={
                        selectedTimeframe === "1 Year" ? "outline" : "ghost"
                      }
                      className={
                        selectedTimeframe === "1 Year"
                          ? "bg-[#222222] text-white border-none hover:bg-[#2a2a2a]"
                          : "text-gray-400 hover:text-white hover:bg-transparent"
                      }
                      onClick={() => setSelectedTimeframe("1 Year")}
                    >
                      1 Year
                    </Button>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getFilteredPerformanceData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                        <XAxis
                          dataKey="date"
                          stroke="#666"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#666"
                          axisLine={false}
                          tickLine={false}
                          domain={[50, 100]}
                          ticks={[50, 65, 80, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111111",
                            border: "1px solid #333333",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ color: "#ffffff" }}
                          labelStyle={{ color: "#999999" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "Students" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Students
                      </h3>
                      <p className="text-gray-400">
                        Manage students in this class
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-2 pl-10 mb-4 focus:outline-none focus:border-[#3B4CCA] placeholder-gray-500"
                    />
                    <svg
                      className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
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
                  <div className="grid grid-cols-[1fr,2fr,1fr,1fr,auto] gap-4 text-sm text-gray-400 mb-4">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Average Score</div>
                    <div>Last Active</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {students
                    .filter(
                      (student) =>
                        student.name
                          .toLowerCase()
                          .includes(studentSearchQuery.toLowerCase()) ||
                        student.email
                          .toLowerCase()
                          .includes(studentSearchQuery.toLowerCase())
                    )
                    .map((student) => (
                      <div
                        key={student.email}
                        className="grid grid-cols-[1fr,2fr,1fr,1fr,auto] gap-4 items-center py-4 text-sm border-t border-[#1F1F1F]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white">
                            {student.initials}
                          </div>
                          <span className="text-white">{student.name}</span>
                        </div>
                        <div className="text-gray-400">{student.email}</div>
                        <div className="text-white">{student.averageScore}</div>
                        <div className="text-gray-400">
                          {student.lastActive}
                        </div>
                        <Button
                          variant="ghost"
                          className="px-2 text-gray-400 hover:text-red-500"
                          onClick={() => handleDeleteStudent(student)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "Exams" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Exams
                      </h3>
                      <p className="text-gray-400">
                        Manage your exams and view performance metrics
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="relative flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-2 pl-10 focus:outline-none focus:border-[#3B4CCA] placeholder-gray-500"
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                          >
                            {rowsPerPage} per page
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1F1F1F] border border-[#333333] text-white">
                          {[10, 20, 50, 100].map((option) => (
                            <DropdownMenuItem
                              key={option}
                              className="hover:bg-[#2a2a2a] cursor-pointer"
                              onClick={() => setRowsPerPage(option)}
                            >
                              {option} per page
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
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
                                  selectedSort === option.value
                                    ? "text-white"
                                    : ""
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

                  <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 text-sm text-gray-400 mb-4">
                    <div>Exam Name</div>
                    <div>Date</div>
                    <div>Avg. Score</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {filteredExams.map((exam) => (
                    <div
                      key={exam.name}
                      className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 items-center py-4 text-sm border-t border-[#1F1F1F]"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-4 h-4 text-[#3B4CCA]"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.2929 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-white">{exam.name}</span>
                      </div>
                      <div className="text-gray-400">{exam.date}</div>
                      <div className="text-white">{exam.averageScore}</div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            exam.status === "Completed"
                              ? "bg-[#3B4CCA] text-white"
                              : "bg-[#1F1F1F] text-white"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
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
                                  `/professor-dashboard/exams/${exam.name}`
                                )
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-[#222222] focus:bg-[#222222] cursor-pointer px-3 py-2 rounded-lg"
                              onClick={() => {
                                setDeleteExamId(exam.name);
                                setIsDeleteExamDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Exam
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                    <div>
                      Showing 1 to {filteredExams.length} of{" "}
                      {filteredExams.length} results
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                        disabled
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                        disabled
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Remove Student
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove {studentToDelete?.name} from this
              class? This action cannot be undone.
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
              onClick={confirmDeleteStudent}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Remove Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NotificationDialog
        open={isNotificationDialogOpen}
        onOpenChange={setIsNotificationDialogOpen}
      />

      <Dialog
        open={isDeleteExamDialogOpen}
        onOpenChange={setIsDeleteExamDialogOpen}
      >
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Delete Exam
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this exam? This action cannot be
              undone. All student responses and scores will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            {examToDelete && (
              <div className="mb-6 p-4 rounded-lg bg-[#111111] border border-[#222222]">
                <div className="font-medium text-white">
                  {examToDelete.name}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {examToDelete.date} • {examToDelete.status}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteExamDialogOpen(false)}
                className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Add delete logic here
                  console.log("Deleting exam:", deleteExamId);
                  setIsDeleteExamDialogOpen(false);
                  setDeleteExamId(null);
                }}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete Exam
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
