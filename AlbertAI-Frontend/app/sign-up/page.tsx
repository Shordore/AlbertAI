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

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Use the environment variable for the API base URL
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051/api";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const classCode = formData.get("classCode");

    // Construct the JSON body matching your backend RegisterRequest DTO
    const requestBody = {
      email: email,
      Password: password,
      Name: name,
      classCode: classCode,
    };

    try {
      const response = await fetch(`${API_URL}/Account/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Registration successful, now automatically log in the user
      const loginResponse = await fetch(`${API_URL}/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          Password: password,
        }),
      });

      if (!loginResponse.ok) {
        // This should rarely happen if registration was successful
        setErrorMsg(
          "Registration successful but login failed. Please sign in manually."
        );
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      // Get the token and store it
      const loginData = await loginResponse.json();
      const token = loginData.Token || loginData.token;
      localStorage.setItem("token", token);

      // Redirect to the student dashboard
      setIsLoading(false);
      router.push("/student-dashboard");
    } catch (error) {
      console.error("Registration/login error:", error);
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
        </div>
      </nav>

      {/* Sign Up Form */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md space-y-6 border border-white/20 rounded-xl p-8"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Join AlbertAI
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Create your account to get started
            </p>
          </div>
          {errorMsg && <p className="text-center text-red-500">{errorMsg}</p>}
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              {/* email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="username"
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter a password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              {/* Course Code Field */}
              <div className="space-y-2">
                <Label htmlFor="classCode" className="text-white">
                  Course Code
                </Label>
                <Input
                  id="classCode"
                  name="classCode"
                  placeholder="Enter your course code"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
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
              Sign Up
            </Button>
          </form>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-400 hover:text-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
