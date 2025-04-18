"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function ClassSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [professorId, setProfessorId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if professor ID is in session storage from registration
    const storedProfessorId = sessionStorage.getItem("professorId");

    if (storedProfessorId) {
      setProfessorId(parseInt(storedProfessorId, 10));
      return;
    }

    // If not in session storage, try to get from token
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfessorData(token);
    }
    // No redirect - continue with the flow even if we don't have ID yet
  }, []);

  const fetchProfessorData = async (token: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
        }/api/professor/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfessorId(data.id);
        // Store for future use in the onboarding flow
        sessionStorage.setItem("professorId", data.id.toString());
      }
    } catch (error) {
      console.error("Error fetching professor data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If we don't have a professor ID yet, try to get one from the backend
      // This handles the case where the professor is already registered
      // but we couldn't fetch the ID in the useEffect
      if (!professorId) {
        const token = localStorage.getItem("token");
        if (token) {
          await fetchProfessorData(token);
        }
      }

      // Get the professor ID from state or use a temporary ID for onboarding
      const idToUse = professorId || -1; // Use -1 as a temporary ID if needed

      // Get the token to use for authentication
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
        }/api/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            code: courseCode,
            className: className,
            professorId: idToUse,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      const data = await response.json();
      // Store the class ID if needed
      if (data.id) {
        sessionStorage.setItem("classId", data.id.toString());
      }

      router.push("/professor-onboarding/class-code");
    } catch (error) {
      console.error("Error creating class:", error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Sparkles Background */}
      <div className="fixed inset-0 w-full h-full">
        <StaticSparkles
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="rgba(255, 255, 255, 0.3)"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.robot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-white">AlbertAI</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-white hover:text-white/80">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded">
              Join Class
            </Button>
          </Link>
        </div>
      </nav>

      {/* Class Setup Form */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-6 border border-white/20 rounded-xl p-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Let's get your first class set up
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Enter your class details to get started
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className" className="text-white">
                  Class Name
                </Label>
                <Input
                  id="className"
                  placeholder="Enter your class name"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode" className="text-white">
                  Course Code
                </Label>
                <Input
                  id="courseCode"
                  placeholder="Enter course code (e.g. CS101)"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Class
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
