"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { StaticSparkles } from "@/components/static-sparkles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Use a fallback in case NEXT_PUBLIC_API_URL isn't defined
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    // Use "ufid" if that's what your backend expects instead of "email"
    const ufid = formData.get("ufid");
    const password = formData.get("password");

    // Construct the request body matching your backend LoginRequest DTO
    const requestBody = {
      UFID: ufid,
      Password: password
    };

    try {
      const response = await fetch(`${API_URL}/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.message || "Login failed");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const token = data.Token;

      // Store token as needed (here using localStorage)
      localStorage.setItem("token", data.token);

      setIsLoading(false);
      router.push("/student-dashboard");
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

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

      {/* Sign In Form */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-6 border border-white/20 rounded-xl p-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Sign in to your AlbertAI account
            </p>
          </div>
          {errorMsg && (
            <p className="text-center text-red-500">{errorMsg}</p>
          )}
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ufid" className="text-white">
                  UFID
                </Label>
                <Input
                  id="ufid"
                  name="ufid"
                  placeholder="Enter your UFID"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
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
              Sign In
            </Button>
          </form>
          <div className="text-center space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-400 hover:text-blue-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}