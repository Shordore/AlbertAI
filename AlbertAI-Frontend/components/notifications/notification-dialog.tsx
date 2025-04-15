"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDialog({
  open,
  onOpenChange,
}: NotificationDialogProps) {
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement notification sending logic
    console.log({ title, selectedClass, message });

    // Show success notification
    toast.success("Notification sent successfully", {
      description: `Your message has been sent to ${selectedClass}`,
    });

    // Close dialog and reset form
    onOpenChange(false);
    setTitle("");
    setSelectedClass("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0A0A] border border-[#1F1F1F] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            Send Notification
          </DialogTitle>
          <p className="text-gray-400">
            Create and send a notification to your students
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-white"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Exam Reminder"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="class"
              className="block text-sm font-medium text-white"
            >
              Class
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a class</option>
              <option value="Biology 101">Biology 101</option>
              <option value="Chemistry 201">Chemistry 201</option>
              <option value="Physics 301">Physics 301</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-white"
            >
              Message
            </label>
            <textarea
              id="message"
              placeholder="Enter your notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              required
            />
          </div>

          <p className="text-sm text-gray-400">
            The notification will be sent immediately to all students in the
            selected class.
          </p>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#3B4CCA] text-white py-2 px-4 rounded-md hover:bg-[#2A3BA9] transition-colors"
          >
            <Send className="w-4 h-4" />
            Send Notification
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
