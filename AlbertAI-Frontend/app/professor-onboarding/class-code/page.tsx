"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Copy } from "lucide-react";
import Link from "next/link";

export default function ClassCode() {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const [classCode, setClassCode] = useState("Loading...");
  const [classId, setClassId] = useState<string | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the class ID from session storage
    const storedClassId = sessionStorage.getItem("classId");
    if (storedClassId) {
      setClassId(storedClassId);

      // Fetch class details from API
      const fetchClassDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setIsLoading(false);
            return;
          }

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
            }/api/classes/${storedClassId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setClassCode(data.code || "ABC123");
            setClassName(data.className || "Your Class");
          }
        } catch (error) {
          console.error("Error fetching class details:", error);
          // Fallback to a default code
          setClassCode("ABC123");
        } finally {
          setIsLoading(false);
        }
      };

      fetchClassDetails();
    } else {
      // Fallback if no class ID is found
      setClassCode("ABC123");
      setIsLoading(false);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(classId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    router.push("/professor-dashboard");
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

      {/* Class Code Display */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-6 border border-white/20 rounded-xl p-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Your Class Code
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Share this code with your students so they can join your class
            </p>
          </div>

          {className && (
            <div className="text-center">
              <p className="text-md text-white">
                Class: <span className="font-medium">{className}</span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2">
            <div className="text-2xl font-bold bg-white/10 px-4 py-2 rounded-md text-white">
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                classId || "Loading..."
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-10 w-10 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {copied && (
            <p className="text-center text-sm text-green-400">
              Code copied to clipboard!
            </p>
          )}
          <Button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
