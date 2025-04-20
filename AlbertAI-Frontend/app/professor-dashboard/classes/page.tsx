"use client";

import { useState, useEffect } from "react";
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

// Delete or comment out the mock classes
// const classes = [...]

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
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    id?: string;
    _id?: string;
    professorId?: string;
    [key: string]: any;
  } | null>(null);

  // New state for class data
  const [classes, setClasses] = useState<
    Array<{
      id: number;
      code: string;
      className: string;
      students: Array<{ id: number; name: string; email: string }>;
      averageScore?: number;
      status: string;
      lastExam?: {
        name: string;
        date: string;
      };
    }>
  >([]);

  // Get current user data
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

  // Fetch classes and exams when the user is loaded
  useEffect(() => {
    const fetchClassesAndExams = async () => {
      const professorId =
        currentUser?.id || currentUser?._id || currentUser?.professorId;

      if (!professorId) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      const baseApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";

      setIsLoading(true);
      try {
        // Fetch classes with students
        const classesUrl = `${baseApiUrl}/classes/professor/${professorId}/with-students`;
        const classesResponse = await fetch(classesUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!classesResponse.ok) {
          throw new Error(
            `Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`
          );
        }

        const classesData = await classesResponse.json();

        // Fetch exams for the professor
        const examsUrl = `${baseApiUrl}/Exam/byprofessor/${professorId}`;
        const examsResponse = await fetch(examsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let examsData: any[] = [];
        if (examsResponse.ok) {
          examsData = await examsResponse.json();
        }

        // Process the data to match our UI needs
        const processedClasses = classesData.map((cls: any) => {
          // Find the latest exam for this class
          const classExams = examsData
            .filter((exam: any) => exam.className === cls.className)
            .sort(
              (a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

          const lastExam =
            classExams.length > 0
              ? {
                  name: classExams[0].title,
                  date: new Date(classExams[0].date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  ),
                }
              : undefined;

          // Calculate average score - this is a placeholder since we don't have this data
          const averageScore = Math.floor(Math.random() * 30) + 65;

          return {
            id: cls.id,
            code: cls.code,
            className: cls.className,
            students: cls.students,
            averageScore: averageScore,
            status: "Active", // Default to Active since we don't have status in the API
            lastExam,
          };
        });

        setClasses(processedClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchClassesAndExams();
    }
  }, [currentUser]);

  const handleAddClass = async () => {
    if (!className || !courseCode) {
      return;
    }

    setIsAddingClass(true);

    // Create the class in the database
    const professorId =
      currentUser?.id || currentUser?._id || currentUser?.professorId;
    if (!professorId) {
      console.error("No professor ID found");
      setIsAddingClass(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsAddingClass(false);
      return;
    }

    const baseApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";
    const apiUrl = `${baseApiUrl}/classes`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: courseCode,
          className: className,
          professorId: professorId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      // Close the dialog and reset form
      setIsAddClassOpen(false);
      setClassName("");
      setCourseCode("");

      // Refresh the class list
      if (currentUser) {
        // This will trigger a re-fetch in the useEffect
        setCurrentUser({ ...currentUser });
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    } finally {
      setIsAddingClass(false);
    }
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

    // Refresh the class list
    if (currentUser) {
      const professorId =
        currentUser.id || currentUser._id || currentUser.professorId;
      if (professorId) {
        // This will trigger a re-fetch in the useEffect
        setCurrentUser({ ...currentUser });
      }
    }
  };

  const handleDeleteClass = async () => {
    if (!deleteClassId) return;

    setIsDeleting(true);

    // In a real app, you would delete the class via API
    // For now, we'll just simulate it with a timeout
    setTimeout(() => {
      // Remove the class from our local state
      setClasses(classes.filter((c) => c.id.toString() !== deleteClassId));
      setIsDeleteDialogOpen(false);
      setDeleteClassId(null);
      setIsDeleting(false);
    }, 1000);
  };

  // Find the class to delete
  const classToDelete = classes.find((c) => c.id.toString() === deleteClassId);

  // Filter and sort classes
  const filteredClasses = classes
    .filter((cls) => {
      if (searchQuery) {
        return cls.className.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "name-asc":
          return a.className.localeCompare(b.className);
        case "name-desc":
          return b.className.localeCompare(a.className);
        case "students-asc":
          return a.students.length - b.students.length;
        case "students-desc":
          return b.students.length - a.students.length;
        case "score-asc":
          return (a.averageScore || 0) - (b.averageScore || 0);
        case "score-desc":
          return (b.averageScore || 0) - (a.averageScore || 0);
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
                  Enter your class name to create a new class
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
                <div className="space-y-2">
                  <label
                    htmlFor="courseCode"
                    className="text-sm font-medium text-white"
                  >
                    Course Code
                  </label>
                  <Input
                    id="courseCode"
                    placeholder="Enter course code..."
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="bg-[#111111] border-[#222222] text-white placeholder-gray-500 focus:border-[#3B4CCA]"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddClassOpen(false)}
                    className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
                    disabled={isAddingClass}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddClass}
                    disabled={!className || !courseCode || isAddingClass}
                    className="bg-[#3B4CCA] text-white hover:bg-[#3343b3]"
                  >
                    {isAddingClass ? (
                      <div className="flex items-center">
                        <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      "Add Class"
                    )}
                  </Button>
                </div>
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

              {isLoading ? (
                <div className="py-20 flex justify-center">
                  <Icons.spinner className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="grid grid-cols-6 text-sm py-4 border-t border-[#1F1F1F] group"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <Users className="h-5 w-5 text-white" />
                      <div>
                        <div className="text-white font-medium">
                          {cls.className}
                        </div>
                        <div className="text-xs text-gray-400">
                          {cls.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-white">{cls.students.length}</div>
                    <div className="text-white">{cls.averageScore || "—"}%</div>
                    <div>
                      {cls.lastExam ? (
                        <>
                          <div className="text-white">{cls.lastExam.name}</div>
                          <div className="text-xs text-gray-400">
                            {cls.lastExam.date}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400">No exams yet</div>
                      )}
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
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-500 hover:text-red-400 focus:text-red-400 hover:bg-[#222222] focus:bg-[#222222] cursor-pointer px-3 py-2 rounded-lg"
                            onClick={() => {
                              setDeleteClassId(cls.id.toString());
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  No classes found. Create a new class to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Delete Class
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this class? This action cannot be
              undone. All associated exams and student data will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            {classToDelete && (
              <div className="mb-6 p-4 rounded-lg bg-[#111111] border border-[#222222]">
                <div className="font-medium text-white">
                  {classToDelete.className}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {classToDelete.students.length} students •{" "}
                  {classToDelete.status}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-transparent border-[#222222] text-white hover:bg-[#222222]"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteClass}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </div>
                ) : (
                  "Delete Class"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
