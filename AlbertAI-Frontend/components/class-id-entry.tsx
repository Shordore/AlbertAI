import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ClassIdEntryProps {
  onNext: (classId: string) => void;
}

export function ClassIdEntry({ onNext }: ClassIdEntryProps) {
  const [classId, setClassId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(classId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          Join Your Class
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Enter your class ID to get started
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="classId" className="text-white">
            Class ID
          </Label>
          <Input
            id="classId"
            placeholder="Enter your class ID"
            type="text"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded"
        >
          Next
        </Button>
      </form>
    </motion.div>
  );
}
