"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import Link from "next/link";
import {
  Book,
  ChevronRight,
  Users,
  Calendar,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Settings,
  LogOut,
  Bot,
  ScrollText,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationDialog } from "@/components/notifications/notification-dialog";

const classes = [
  {
    id: "bio101",
    name: "Biology 101",
    students: 32,
    averageScore: 78,
    status: "Active",
  },
  {
    id: "chem201",
    name: "Chemistry 201",
    students: 28,
    averageScore: 72,
    status: "Active",
  },
  {
    id: "phys301",
    name: "Physics 301",
    students: 24,
    averageScore: 81,
    status: "Active",
  },
];

// Update the mock data to include more data points
const performanceData = [
  { date: "Jan 1", Biology: 82, Chemistry: 70, Physics: 62 },
  { date: "Jan 10", Biology: 83, Chemistry: 71, Physics: 63 },
  { date: "Jan 20", Biology: 85, Chemistry: 72, Physics: 65 },
  { date: "Jan 31", Biology: 87, Chemistry: 75, Physics: 68 },
  { date: "Feb 10", Biology: 88, Chemistry: 76, Physics: 70 },
  { date: "Feb 22", Biology: 89, Chemistry: 77, Physics: 72 },
  { date: "Mar 5", Biology: 90, Chemistry: 78, Physics: 73 },
  { date: "Mar 15", Biology: 92, Chemistry: 79, Physics: 75 },
  { date: "Mar 25", Biology: 93, Chemistry: 80, Physics: 77 },
  { date: "Mar 31", Biology: 94, Chemistry: 81, Physics: 78 },
  { date: "Apr 7", Biology: 96, Chemistry: 82, Physics: 81 },
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

const exams = [
  {
    id: "exam1",
    name: "Midterm Exam",
    class: "Biology 101",
    classId: "bio101",
    date: "Mar 15, 2025",
    status: "Completed",
    averageScore: 78,
  },
  {
    id: "exam2",
    name: "Pop Quiz",
    class: "Chemistry 201",
    classId: "chem201",
    date: "Mar 10, 2025",
    status: "Completed",
    averageScore: 72,
  },
  {
    id: "exam4",
    name: "Final Exam",
    class: "Biology 101",
    classId: "bio101",
    date: "Apr 20, 2025",
    status: "Scheduled",
    averageScore: null,
  },
];

export default function ProfessorDashboard() {
  interface ExamData {
    id?: string;
    _id?: string;
    examName?: string;
    name?: string;
    title?: string;
    className?: string;
    class?: string;
    examDate?: string;
    date?: string;
    classPreparedness?: number;
    averageScore?: number;
    status?: string;
  }

  interface ProcessedExam {
    id: string;
    examName: string;
    className: string;
    examDate: string;
    classPreparedness?: number;
    status: string;
  }

  // Define type for filter options
  interface FilterOption {
    label: string;
    value?: string;
    type: string;
    className?: string;
  }

  const [selectedTimeframe, setSelectedTimeframe] = useState("1 Month");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    id?: string;
    _id?: string;
    professorId?: string;
    [key: string]: any;
  } | null>(null);
  const [exams, setExams] = useState<ProcessedExam[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [classes, setClasses] = useState<
    Array<{
      id: number;
      code: string;
      className: string;
      students: Array<{ id: number; name: string; email: string }>;
      averageScore?: number;
    }>
  >([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const baseApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";
    const apiUrl = `${baseApiUrl}/professor/me`;

    fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // Check all possible ID field names
        if (data && !data.id && !data._id && data.professorId) {
          data.id = data.professorId;
        } else if (data && !data.id && data._id) {
          data.id = data._id;
        }
        setCurrentUser(data);
      })
      .catch((err) => {
        console.error("Error fetching professor data:", err);
      });
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      const professorId =
        currentUser?.id || currentUser?._id || currentUser?.professorId;

      if (!professorId) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      const baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";
      const apiUrl = `${baseApiUrl}/Exam/byprofessor/${professorId}`;

      setIsLoadingExams(true);
      try {
        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch exams: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Check if data is wrapped in a response object
        const examsList: ExamData[] = Array.isArray(data)
          ? data
          : data.exams || data.data || [];

        // Map the data to match our expected format
        const processedExams: ProcessedExam[] = examsList.map((exam) => ({
          id: exam.id || exam._id || "",
          examName: exam.examName || exam.name || exam.title || "",
          className: exam.className || exam.class || "",
          examDate: exam.examDate || exam.date || "",
          classPreparedness: exam.classPreparedness || exam.averageScore,
          status:
            exam.status ||
            (new Date(exam.examDate || exam.date || "") > new Date()
              ? "Scheduled"
              : "Completed"),
        }));

        setExams(processedExams);
      } catch (error) {
        console.error("Error fetching exams:", error);
        setExams([]);
      } finally {
        setIsLoadingExams(false);
      }
    };

    fetchExams();
  }, [currentUser]);

  useEffect(() => {
    const fetchClasses = async () => {
      const professorId =
        currentUser?.id || currentUser?._id || currentUser?.professorId;

      if (!professorId) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      const baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";
      const apiUrl = `${baseApiUrl}/classes/professor/${professorId}/with-students`;

      setIsLoadingClasses(true);
      try {
        const response = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch classes: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [currentUser]);

  // Generate filter options when exams change
  useEffect(() => {
    // Get unique class names from exams with type safety
    const classNames: string[] = [];
    exams.forEach((exam) => {
      // Use the normalized className from our processed exams
      if (exam.className && !classNames.includes(exam.className)) {
        classNames.push(exam.className);
      }
    });

    // Create filter options with status and dynamically added classes
    const options: FilterOption[] = [
      { label: "Status", type: "header" },
      { label: "Completed", value: "completed", type: "checkbox" },
      { label: "Scheduled", value: "scheduled", type: "checkbox" },
      { label: "Classes", type: "header" },
    ];

    // Add each unique class
    classNames.forEach((className) => {
      // Create a value from className that's suitable for filtering
      // Replace spaces with underscores and lowercase
      const classValue = className.replace(/\s+/g, "_").toLowerCase();
      options.push({
        label: className,
        value: classValue,
        type: "checkbox",
        className: className, // Store original class name for filtering
      });
    });

    // If no classes were found, add some default placeholders
    if (classNames.length === 0) {
      options.push({
        label: "Biology 101",
        value: "biology_101",
        type: "checkbox",
        className: "Biology 101",
      });
      options.push({
        label: "Chemistry 201",
        value: "chemistry_201",
        type: "checkbox",
        className: "Chemistry 201",
      });
      options.push({
        label: "Physics 301",
        value: "physics_301",
        type: "checkbox",
        className: "Physics 301",
      });
    }

    setFilterOptions(options);

    // Initialize selectedFilters with all class values and status filters
    const initialFilters = [
      "completed",
      "scheduled",
      ...options
        .filter((option) => option.type === "checkbox" && option.className)
        .map((option) => option.value || ""),
    ];

    setSelectedFilters(initialFilters);
  }, [exams]);

  const sortOptions = [
    { label: "Exam Name (A-Z)", value: "name-asc" },
    { label: "Exam Name (Z-A)", value: "name-desc" },
    { label: "Class Name (A-Z)", value: "class-asc" },
    { label: "Class Name (Z-A)", value: "class-desc" },
    { label: "Date (Newest)", value: "date-desc" },
    { label: "Date (Oldest)", value: "date-asc" },
  ];

  // Add this near the top with other constants
  const rowsPerPageOptions = [
    { label: "10 per page", value: 10 },
    { label: "20 per page", value: 20 },
    { label: "50 per page", value: 50 },
    { label: "100 per page", value: 100 },
  ];

  // Add this with other mock data at the top
  const notifications = [
    {
      id: "notif1",
      title: "Midterm Exam Reminder",
      class: "Biology 101",
      sentDate: "Mar 10, 2025",
      recipients: 32,
      readRate: 94,
      status: "Sent",
    },
    {
      id: "notif2",
      title: "Lab Practical Instructions",
      class: "Physics 301",
      sentDate: "Apr 2, 2025",
      recipients: 24,
      readRate: 87,
      status: "Sent",
    },
    {
      id: "notif3",
      title: "Study Guide Available",
      class: "Chemistry 201",
      sentDate: "Mar 25, 2025",
      recipients: 28,
      readRate: 75,
      status: "Sent",
    },
    {
      id: "notif4",
      title: "Final Exam Announcement",
      class: "Biology 101",
      sentDate: "Apr 15, 2025",
      recipients: 32,
      readRate: null,
      status: "Scheduled",
    },
  ];

  // Update the notification filter options to use full class names
  const notificationFilterOptions = [
    { label: "Classes", type: "header" },
    { label: "Biology 101", value: "Biology 101", type: "checkbox" },
    { label: "Chemistry 201", value: "Chemistry 201", type: "checkbox" },
    { label: "Physics 301", value: "Physics 301", type: "checkbox" },
  ];

  const notificationSortOptions = [
    { label: "Title (A-Z)", value: "title-asc" },
    { label: "Title (Z-A)", value: "title-desc" },
    { label: "Class Name (A-Z)", value: "class-asc" },
    { label: "Class Name (Z-A)", value: "class-desc" },
    { label: "Date (Newest)", value: "date-desc" },
    { label: "Date (Oldest)", value: "date-asc" },
    { label: "Read Rate (Highest)", value: "read-desc" },
    { label: "Read Rate (Lowest)", value: "read-asc" },
  ];

  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "completed",
    "scheduled",
    "bio101",
    "chem201",
    "phys301",
  ]);
  const [selectedSort, setSelectedSort] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationSearchQuery, setNotificationSearchQuery] = useState("");
  const [selectedNotificationFilters, setSelectedNotificationFilters] =
    useState<string[]>(["Biology 101", "Chemistry 201", "Physics 301"]);
  const [selectedNotificationSort, setSelectedNotificationSort] =
    useState("date-desc");
  const [notificationRowsPerPage, setNotificationRowsPerPage] = useState(10);
  const [currentNotificationPage, setCurrentNotificationPage] = useState(1);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [deleteNotificationId, setDeleteNotificationId] = useState<
    string | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState<string | null>(null);
  const [isDeleteExamDialogOpen, setIsDeleteExamDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const notificationToDelete = notifications.find(
    (n) => n.id === deleteNotificationId
  );
  const examToDelete = exams.find((e) => e.id === deleteExamId);
  const router = useRouter();

  // Function to delete an exam by ID
  const deleteExam = async (examId: string) => {
    if (!examId) return;

    // Set loading state
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        setIsDeleting(false);
        return;
      }

      const baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";
      const apiUrl = `${baseApiUrl}/Exam/${examId}`;

      console.log(`Attempting to delete exam with ID: ${examId}`);
      console.log(`Request URL: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`Delete response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete exam: ${response.status} ${response.statusText}. Details: ${errorText}`
        );
      }

      console.log(`Successfully deleted exam with ID: ${examId}`);

      // Remove the deleted exam from the state
      setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));

      // Close the dialog and clear the deleteExamId
      setIsDeleteExamDialogOpen(false);
      setDeleteExamId(null);
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert(
        `Failed to delete exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      // Always reset loading state
      setIsDeleting(false);
    }
  };

  const initials =
    currentUser?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "";

  // Update filter logic to properly filter by class name
  const filteredExams = exams
    .filter((exam: ProcessedExam) => {
      // Search filter
      if (searchQuery) {
        return exam.examName.toLowerCase().includes(searchQuery.toLowerCase());
      }

      // Status filters - only show exams whose status is in the selected filters
      const statusFilter =
        (exam.status === "Completed" &&
          selectedFilters.includes("completed")) ||
        (exam.status === "Scheduled" && selectedFilters.includes("scheduled"));

      if (!statusFilter) return false;

      // Find the class filter value for this exam's class
      const classFilterOption = filterOptions.find(
        (option) =>
          option.className === exam.className && option.type === "checkbox"
      );

      // Check if the class filter is selected
      const classValue = classFilterOption?.value || "";
      return selectedFilters.includes(classValue);
    })
    .sort((a: ProcessedExam, b: ProcessedExam) => {
      switch (selectedSort) {
        case "name-asc":
          return a.examName.localeCompare(b.examName);
        case "name-desc":
          return b.examName.localeCompare(a.examName);
        case "class-asc":
          return a.className.localeCompare(b.className);
        case "class-desc":
          return b.className.localeCompare(a.className);
        case "date-asc":
          return (
            new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
          );
        case "date-desc":
          return (
            new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
          );
        default:
          return 0;
      }
    });

  // Pagination based on filtered exams
  const totalPages = Math.ceil(filteredExams.length / rowsPerPage);
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Update the filtering logic to use exact class name matching
  const filteredNotifications = notifications
    .filter((notification) => {
      // Search filter
      if (notificationSearchQuery) {
        return notification.title
          .toLowerCase()
          .includes(notificationSearchQuery.toLowerCase());
      }

      // If no filters selected, show all
      if (selectedNotificationFilters.length === 0) {
        return true;
      }

      // Class filters - exact match with the class name
      return selectedNotificationFilters.includes(notification.class);
    })
    .sort((a, b) => {
      switch (selectedNotificationSort) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "class-asc":
          return a.class.localeCompare(b.class);
        case "class-desc":
          return b.class.localeCompare(a.class);
        case "date-asc":
          return (
            new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime()
          );
        case "date-desc":
          return (
            new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
          );
        case "read-asc":
          return (a.readRate || 0) - (b.readRate || 0);
        case "read-desc":
          return (b.readRate || 0) - (a.readRate || 0);
        default:
          return 0;
      }
    });

  // Add pagination for notifications
  const totalNotificationPages = Math.ceil(
    filteredNotifications.length / notificationRowsPerPage
  );
  const paginatedNotifications = filteredNotifications.slice(
    (currentNotificationPage - 1) * notificationRowsPerPage,
    currentNotificationPage * notificationRowsPerPage
  );

  const generateCourseCode = () => {
    setIsGeneratingCode(true);
    // Simulate API call delay
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCourseCode(code);
      setIsGeneratingCode(false);
    }, 1000);
  };

  const handleAddClass = () => {
    // Add class logic here
    console.log("Adding class:", { className, courseCode });
    setIsAddClassOpen(false);
    setClassName("");
    setCourseCode("");
  };

  const handleSignOut = () => {
    router.push("/");
  };

  // Add this function to filter data based on timeframe
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

  const handleDeleteNotification = () => {
    // Add delete logic here
    console.log("Deleting notification:", deleteNotificationId);
    setIsDeleteDialogOpen(false);
    setDeleteNotificationId(null);
  };

  // Add this function to get upcoming tests from exams
  const getUpcomingTests = () => {
    if (isLoadingExams || exams.length === 0) {
      return [];
    }

    const now = new Date();

    // Filter exams that are scheduled in the future
    return (
      exams
        .filter((exam) => {
          const examDate = new Date(exam.examDate);
          return examDate > now && exam.status === "Scheduled";
        })
        // Sort by date (closest first)
        .sort((a, b) => {
          return (
            new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
          );
        })
        // Take the first 5 or fewer
        .slice(0, 5)
        // Map to the format expected by the UI
        .map((exam) => {
          // Format the date string
          let formattedDate = "";
          try {
            const date = new Date(exam.examDate);
            formattedDate =
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) +
              " - " +
              date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
          } catch (e) {
            formattedDate = exam.examDate;
          }

          // Determine icon based on exam name
          let icon = <ScrollText className="w-5 h-5 text-white" />;
          if (exam.examName.toLowerCase().includes("quiz")) {
            icon = <BookOpen className="w-5 h-5 text-white" />;
          } else if (
            exam.examName.toLowerCase().includes("lab") ||
            exam.examName.toLowerCase().includes("practical")
          ) {
            icon = <ClipboardCheck className="w-5 h-5 text-white" />;
          }

          return {
            title: exam.examName,
            date: formattedDate,
            course: exam.className,
            icon: icon,
          };
        })
    );
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
                      {initials}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {currentUser?.name || ""}
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
                {isLoadingExams ? (
                  <div className="flex justify-center p-4">
                    <Icons.spinner className="h-6 w-6 animate-spin text-white" />
                  </div>
                ) : getUpcomingTests().length > 0 ? (
                  getUpcomingTests().map((test, index) => (
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
                  ))
                ) : (
                  <div className="text-center p-4 text-zinc-400">
                    No upcoming tests or quizzes
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-zinc-800">
            <Bot className="w-8 h-8 text-[#3B4CCA]" />
            <span className="text-xl font-semibold text-white">AlbertAI</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Classes Overview */}
              <Card className="bg-gradient-to-br from-[#3B4CCA] to-[#0000FF] text-white rounded-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Classes Overview
                    </span>
                    <Link
                      href="/professor-dashboard/classes"
                      className="flex items-center text-sm font-normal hover:underline"
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Monitor class preparedness scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingClasses ? (
                    <div className="flex justify-center py-8">
                      <Icons.spinner className="h-6 w-6 animate-spin" />
                    </div>
                  ) : classes.length > 0 ? (
                    <div className="space-y-4">
                      {classes.map((cls) => (
                        <Link
                          key={cls.id}
                          href={`/professor-dashboard/classes/${cls.id}`}
                          className="flex items-center justify-between rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{cls.className}</div>
                              <div className="text-xs text-white/70">
                                {cls.students.length} students
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {cls.averageScore || "—"}%
                            </div>
                            <div className="text-xs text-white/70">
                              Class Preparedness
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/70">
                      No classes found. Create a new class to get started.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Exam Overview */}
              <Card className="bg-gradient-to-br from-[#D97706] to-[#92400E] text-white rounded-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Exam Overview
                    </span>
                    <button
                      onClick={() => {
                        document
                          .getElementById("exams-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex items-center text-sm font-normal hover:underline"
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Recent and upcoming exams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingExams ? (
                    <div className="flex justify-center py-8">
                      <Icons.spinner className="h-6 w-6 animate-spin" />
                    </div>
                  ) : filteredExams && filteredExams.length > 0 ? (
                    <div className="space-y-4">
                      {filteredExams.slice(0, 3).map((exam: ProcessedExam) => (
                        <Link
                          key={exam.id}
                          href={`/professor-dashboard/exams/${exam.id}`}
                          className="flex items-center justify-between rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{exam.examName}</div>
                              <div className="text-xs text-white/70">
                                {exam.className}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {new Date(exam.examDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-xs text-white/70">
                              {exam.status}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/70">
                      No exams found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Performance Graph */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F] p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Performance Over Time
                  </h2>
                  <p className="text-sm text-gray-400">
                    Average scores across all classes over time
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#222222] text-white border-zinc-800 hover:bg-[#2a2a2a]"
                    >
                      All Classes
                      <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111111] border border-zinc-800">
                    <DropdownMenuItem className="text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer">
                      All Classes
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer">
                      Biology 101
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer">
                      Chemistry 201
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer">
                      Physics 301
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  variant={selectedTimeframe === "1 Year" ? "outline" : "ghost"}
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
                      dataKey="Biology"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Chemistry"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Physics"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* All Exams Table */}
            <div
              id="exams-section"
              className="bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F] mb-8"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Exams</h2>
                    <p className="text-sm text-gray-400">
                      Manage your exams and view performance metrics
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search exams..."
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
                            {rowsPerPage} per page
                            <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#111111] border border-zinc-800 rounded-xl p-1 min-w-[160px]">
                          {rowsPerPageOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer px-3 py-2"
                              onClick={() => {
                                setRowsPerPage(option.value);
                                setCurrentPage(1);
                              }}
                            >
                              <span
                                className={
                                  rowsPerPage === option.value
                                    ? "text-white"
                                    : ""
                                }
                              >
                                {option.label}
                              </span>
                              {rowsPerPage === option.value && (
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
                                d="M3 4.5h18M3 12h18M3 19.5h18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Filter{" "}
                            {selectedFilters.length > 0 &&
                              `(${selectedFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#111111] border border-zinc-800 rounded-xl p-1 min-w-[200px]">
                          {filterOptions.map((option, index) =>
                            option.type === "header" ? (
                              <div key={option.label} className="px-3 py-2">
                                <div className="text-sm font-medium text-gray-400">
                                  {option.label}
                                </div>
                                {index > 0 && (
                                  <div className="h-px bg-zinc-800 my-2"></div>
                                )}
                              </div>
                            ) : (
                              <DropdownMenuItem
                                key={option.value}
                                className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer px-3 py-2"
                                onSelect={(e: Event) => {
                                  e.preventDefault();
                                  if (selectedFilters.includes(option.value!)) {
                                    setSelectedFilters(
                                      selectedFilters.filter(
                                        (f) => f !== option.value
                                      )
                                    );
                                  } else {
                                    setSelectedFilters([
                                      ...selectedFilters,
                                      option.value!,
                                    ]);
                                  }
                                }}
                              >
                                <div
                                  className={`w-4 h-4 border rounded ${
                                    selectedFilters.includes(option.value!)
                                      ? "bg-[#3B4CCA] border-[#3B4CCA]"
                                      : "border-gray-400"
                                  } flex items-center justify-center`}
                                >
                                  {selectedFilters.includes(option.value!) && (
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 10 10"
                                      fill="none"
                                    >
                                      <path
                                        d="M8.5 2.5L3.5 7.5L1.5 5.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span>{option.label}</span>
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

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
                    <Button
                      className="bg-[#3B4CCA] text-white hover:bg-[#3343b3] rounded-xl"
                      onClick={() =>
                        router.push("/professor-dashboard/exams/create")
                      }
                    >
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
                      Create New Exam
                    </Button>
                  </div>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-7 text-sm font-medium text-gray-400 mb-4">
                    <div className="col-span-2">Exam Name</div>
                    <div>Class</div>
                    <div>Date</div>
                    <div>Class Preparedness</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>

                  {isLoadingExams ? (
                    <div className="py-20 flex justify-center">
                      <Icons.spinner className="h-8 w-8 animate-spin text-white" />
                    </div>
                  ) : paginatedExams.length > 0 ? (
                    paginatedExams.map((exam: ProcessedExam) => (
                      <div
                        key={exam.id}
                        className="grid grid-cols-7 text-sm py-4 border-t border-[#1F1F1F] group"
                      >
                        <div className="col-span-2 text-white font-medium">
                          {exam.examName}
                        </div>
                        <div className="text-white">{exam.className}</div>
                        <div className="text-white">
                          {new Date(exam.examDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-white">
                          {exam.classPreparedness
                            ? `${exam.classPreparedness}%`
                            : "—"}
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              exam.status === "Completed"
                                ? "bg-[#3B4CCA] text-white"
                                : "bg-[#222222] text-white"
                            }`}
                          >
                            {exam.status}
                          </span>
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
                                    `/professor-dashboard/exams/${exam.id}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-[#222222] focus:bg-[#222222] cursor-pointer px-3 py-2 rounded-lg"
                                onClick={() => {
                                  setDeleteExamId(exam.id);
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
                    ))
                  ) : (
                    <div className="py-20 text-center text-gray-400">
                      No exams found. Create a new exam to get started.
                    </div>
                  )}

                  {/* Pagination */}
                  {!isLoadingExams && filteredExams.length > 0 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1F1F1F]">
                      <div className="text-sm text-gray-400">
                        Showing{" "}
                        {Math.min(
                          (currentPage - 1) * rowsPerPage + 1,
                          filteredExams.length
                        )}{" "}
                        to{" "}
                        {Math.min(
                          currentPage * rowsPerPage,
                          filteredExams.length
                        )}{" "}
                        of {filteredExams.length} results
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="bg-[#222222] text-white border-zinc-800 hover:bg-[#2a2a2a] rounded-xl"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-[#222222] text-white border-zinc-800 hover:bg-[#2a2a2a] rounded-xl"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications Table */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-[#1F1F1F]">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Notifications
                    </h2>
                    <p className="text-sm text-gray-400">
                      View and manage your sent and scheduled notifications
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={notificationSearchQuery}
                        onChange={(e) =>
                          setNotificationSearchQuery(e.target.value)
                        }
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
                            {notificationRowsPerPage} per page
                            <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#111111] border border-zinc-800 rounded-xl p-1 min-w-[160px]">
                          {rowsPerPageOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer px-3 py-2"
                              onClick={() => {
                                setNotificationRowsPerPage(option.value);
                                setCurrentNotificationPage(1);
                              }}
                            >
                              <span
                                className={
                                  notificationRowsPerPage === option.value
                                    ? "text-white"
                                    : ""
                                }
                              >
                                {option.label}
                              </span>
                              {notificationRowsPerPage === option.value && (
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
                                d="M3 4.5h18M3 12h18M3 19.5h18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#111111] border border-zinc-800 rounded-xl p-1 min-w-[200px]">
                          {notificationFilterOptions.map((option, index) =>
                            option.type === "header" ? (
                              <div key={option.label} className="px-3 py-2">
                                <div className="text-sm font-medium text-gray-400">
                                  {option.label}
                                </div>
                                {index > 0 && (
                                  <div className="h-px bg-zinc-800 my-2"></div>
                                )}
                              </div>
                            ) : (
                              <DropdownMenuItem
                                key={option.value}
                                className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer px-3 py-2"
                                onSelect={(e: Event) => {
                                  e.preventDefault();
                                  if (
                                    selectedNotificationFilters.includes(
                                      option.value!
                                    )
                                  ) {
                                    setSelectedNotificationFilters(
                                      selectedNotificationFilters.filter(
                                        (f) => f !== option.value
                                      )
                                    );
                                  } else {
                                    setSelectedNotificationFilters([
                                      ...selectedNotificationFilters,
                                      option.value!,
                                    ]);
                                  }
                                }}
                              >
                                <div
                                  className={`w-4 h-4 border rounded ${
                                    selectedNotificationFilters.includes(
                                      option.value!
                                    )
                                      ? "bg-[#3B4CCA] border-[#3B4CCA]"
                                      : "border-gray-400"
                                  } flex items-center justify-center`}
                                >
                                  {selectedNotificationFilters.includes(
                                    option.value!
                                  ) && (
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 10 10"
                                      fill="none"
                                    >
                                      <path
                                        d="M8.5 2.5L3.5 7.5L1.5 5.5"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span>{option.label}</span>
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

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
                          {notificationSortOptions.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white hover:bg-transparent focus:bg-transparent cursor-pointer px-3 py-2"
                              onClick={() =>
                                setSelectedNotificationSort(option.value)
                              }
                            >
                              <span
                                className={
                                  selectedNotificationSort === option.value
                                    ? "text-white"
                                    : ""
                                }
                              >
                                {option.label}
                              </span>
                              {selectedNotificationSort === option.value && (
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
                    <Button
                      className="bg-[#3B4CCA] text-white hover:bg-[#3343b3] rounded-xl"
                      onClick={() => setIsNotificationDialogOpen(true)}
                    >
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
                      Create New Notification
                    </Button>
                  </div>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-7 text-sm font-medium text-gray-400 mb-4">
                    <div className="col-span-2">Title</div>
                    <div>Class</div>
                    <div>Sent Date</div>
                    <div>Recipients</div>
                    <div>Read Rate</div>
                    <div className="text-right">Actions</div>
                  </div>

                  {paginatedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="grid grid-cols-7 text-sm py-4 border-t border-[#1F1F1F] group"
                    >
                      <div className="col-span-2 text-white font-medium">
                        {notification.title}
                      </div>
                      <div className="text-white">{notification.class}</div>
                      <div className="text-white">{notification.sentDate}</div>
                      <div className="text-white">
                        {notification.recipients}
                      </div>
                      <div className="text-white">
                        {notification.readRate
                          ? `${notification.readRate}%`
                          : "—"}
                      </div>
                      <div className="text-right">
                        <Button
                          variant="ghost"
                          className="px-2 text-gray-400 hover:text-red-500"
                          onClick={() => {
                            setDeleteNotificationId(notification.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1F1F1F]">
                    <div className="text-sm text-gray-400">
                      Showing{" "}
                      {Math.min(
                        (currentNotificationPage - 1) *
                          notificationRowsPerPage +
                          1,
                        filteredNotifications.length
                      )}{" "}
                      to{" "}
                      {Math.min(
                        currentNotificationPage * notificationRowsPerPage,
                        filteredNotifications.length
                      )}{" "}
                      of {filteredNotifications.length} results
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="bg-[#222222] text-white border-zinc-800 hover:bg-[#2a2a2a] rounded-xl"
                        onClick={() =>
                          setCurrentNotificationPage(
                            currentNotificationPage - 1
                          )
                        }
                        disabled={currentNotificationPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-[#222222] text-white border-zinc-800 hover:bg-[#2a2a2a] rounded-xl"
                        onClick={() =>
                          setCurrentNotificationPage(
                            currentNotificationPage + 1
                          )
                        }
                        disabled={
                          currentNotificationPage === totalNotificationPages
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Class
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your class name and we'll generate a unique course code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
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
            {className && (
              <div className="space-y-4">
                <Button
                  onClick={generateCourseCode}
                  disabled={isGeneratingCode}
                  className="w-full bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
                >
                  {isGeneratingCode ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    "Generate Course Code"
                  )}
                </Button>
                {courseCode && (
                  <div className="p-4 rounded-xl bg-[#111111] border border-[#222222]">
                    <p className="text-sm text-gray-400 mb-2">Course Code:</p>
                    <p className="text-2xl font-mono font-bold text-white">
                      {courseCode}
                    </p>
                  </div>
                )}
              </div>
            )}
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
                disabled={!className || !courseCode}
                className="bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
              >
                Add Class
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NotificationDialog
        open={isNotificationDialogOpen}
        onOpenChange={setIsNotificationDialogOpen}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Delete Notification
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            {notificationToDelete && (
              <div className="mb-6 p-4 rounded-lg bg-[#111111] border border-[#222222]">
                <div className="font-medium text-white">
                  {notificationToDelete.title}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Sent to {notificationToDelete.class} •{" "}
                  {notificationToDelete.sentDate}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteNotification}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete Notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            {examToDelete && (
              <div className="mb-6 p-4 rounded-lg bg-[#111111] border border-[#222222]">
                <div className="font-medium text-white">
                  {examToDelete.examName}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {examToDelete.className} •{" "}
                  {new Date(examToDelete.examDate).toLocaleDateString()}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteExamDialogOpen(false)}
                className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Call the delete function with the exam ID
                  if (deleteExamId) {
                    deleteExam(deleteExamId);
                  }
                }}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete Exam"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
