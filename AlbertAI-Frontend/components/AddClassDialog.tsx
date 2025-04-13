"use client";

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

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClassDialog({ open, onOpenChange }: AddClassDialogProps) {
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
            type="submit"
            className="bg-[#3B4CCA] hover:bg-[#3B4CCA]/90 text-white rounded-xl px-6"
          >
            Add Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
