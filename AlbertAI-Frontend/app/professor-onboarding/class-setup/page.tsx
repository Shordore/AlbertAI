"use client";

import { useState } from "react";
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
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Add class creation logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/professor-onboarding/class-code");
    }, 2000);
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
              Enter the name of your class to get started
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
