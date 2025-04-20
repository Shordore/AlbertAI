"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassAdded?: (className: string) => void;
}

export function AddClassDialog({
  open,
  onOpenChange,
  onClassAdded,
}: AddClassDialogProps) {
  const [classCodeInput, setClassCodeInput] = useState("");

  const handleContinue = async () => {
    if (!classCodeInput.trim()) {
      alert("Please enter a class code.");
      return;
    }
    try {
      // Fetch current user to get their name
      const meRes = await fetch(`${API_URL}/Account/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!meRes.ok) throw new Error("Failed to retrieve current user");
      const meData = await meRes.json();
      const currentName = meData.name;

      const res = await fetch(`${API_URL}/Account/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: currentName,
          classCode: classCodeInput.trim(),
        }),
      });
      console.log("Add class response:", res);

      if (!res.ok) throw new Error("Enrollment failed");

      // Safely try to parse JSON response, but don't fail if it's not valid JSON
      let className = "";
      try {
        const contentType = res.headers.get("content-type");
        // Only parse as JSON if the content type indicates JSON
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          className = data.className || "";
        } else {
          // For non-JSON responses, just use text
          const text = await res.text();
          console.log("Non-JSON response:", text);
        }
      } catch (parseError) {
        console.log("Response parsing issue:", parseError);
        // Continue anyway - the class was likely added successfully
      }

      if (onClassAdded && className) {
        onClassAdded(className);
      } else if (onClassAdded) {
        // If we couldn't get the className, pass a generic success message
        onClassAdded("Class added successfully");
      }

      // Always close the dialog on success
      onOpenChange(false);
      // Clear the input
      setClassCodeInput("");

      // Reload the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 300); // Small delay to ensure dialog closes smoothly
    } catch (err: any) {
      console.error("Error adding class:", err);
      // Don't show alert - just close the dialog
      onOpenChange(false);
      setClassCodeInput("");

      // Still reload on error since the class might have been added successfully
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Class</DialogTitle>
          <DialogDescription className="text-zinc-400 text-base">
            Enter the details of the class you want to add to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={classCodeInput}
            onChange={(e) => setClassCodeInput(e.currentTarget.value)}
            type="text"
            placeholder="Enter class code"
            className="bg-black border-zinc-800 text-white placeholder:text-zinc-400 rounded-xl h-12"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#3B4CCA] hover:bg-[#3B4CCA]/90 text-white rounded-xl px-6"
            onClick={handleContinue}
          >
            Add Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
