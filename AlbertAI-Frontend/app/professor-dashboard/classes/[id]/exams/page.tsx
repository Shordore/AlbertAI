"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Plus,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const exams = [
  {
    name: "Midterm Exam",
    class: "Biology 101",
    date: "Mar 15, 2025",
    averageScore: "78%",
    status: "Completed",
  },
  {
    name: "Final Exam",
    class: "Biology 101",
    date: "Apr 20, 2025",
    averageScore: "—",
    status: "Scheduled",
  },
];

export default function Exams() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState("10 per page");

  const filteredExams = exams.filter((exam) =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="p-6">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">Exams</h1>
              <p className="text-gray-400">
                Manage your exams and view performance metrics
              </p>
            </div>
            <Button
              className="bg-[#3B4CCA] text-white hover:bg-[#3343b3] rounded-xl"
              onClick={() => router.push("/professor-dashboard/exams/create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Exam
            </Button>
          </div>

          <div className="bg-[#0A0A0A] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111111] text-white border border-[#222222] rounded-xl px-4 py-2 pl-10 focus:outline-none focus:border-[#3B4CCA] placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                    >
                      {rowsPerPage}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1F1F1F] border border-[#333333] text-white">
                    {[
                      "10 per page",
                      "20 per page",
                      "50 per page",
                      "100 per page",
                    ].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => setRowsPerPage(option)}
                        className="hover:bg-[#2a2a2a] cursor-pointer"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#1F1F1F] text-white border-0 hover:bg-[#2a2a2a] rounded-xl"
                >
                  Sort
                </Button>
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
                key={exam.name + exam.date}
                className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] gap-4 items-center py-4 text-sm border-t border-[#1F1F1F]"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-[#3B4CCA]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
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
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
              <div>
                Showing 1 to {filteredExams.length} of {filteredExams.length}{" "}
                results
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
        </div>
      </div>
    </div>
  );
}
