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

export default function ProfessorOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Register the professor
      const registerResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
        }/api/professor/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // 2. Immediately login to get the token
      const loginResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
        }/api/professor/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Login after registration failed");
      }

      const loginData = await loginResponse.json();

      // 3. Store the token
      localStorage.setItem("token", loginData.token);

      // 4. Fetch professor info to get the ID
      const professorResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5051"
        }/api/professor/me`,
        {
          headers: {
            Authorization: `Bearer ${loginData.token}`,
          },
        }
      );

      if (professorResponse.ok) {
        const professorData = await professorResponse.json();
        sessionStorage.setItem("professorId", professorData.id.toString());
      }

      setIsLoading(false);
      router.push("/professor-onboarding/class-setup");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration error");
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
              Welcome Professor!
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              Let's get you set up with your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              Continue
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
