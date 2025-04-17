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

export function AddClassDialog({ open, onOpenChange, onClassAdded }: AddClassDialogProps) {
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
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!meRes.ok) throw new Error("Failed to retrieve current user");
      const meData = await meRes.json();
      const currentName = meData.name;

      const res = await fetch(
        `${API_URL}/Account/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: currentName,
            classCode: classCodeInput.trim(),
          }),
        }
      );
      console.log(res);
      if (!res.ok) throw new Error("Enrollment failed");
      const data = await res.json();
      if (onClassAdded && data.className) {
        onClassAdded(data.className);
      }
      onOpenChange(false);
    } catch (err: any) {
      alert(err.message || "Failed to add class");
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
