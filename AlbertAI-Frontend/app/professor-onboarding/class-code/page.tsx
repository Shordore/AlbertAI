"use client";

import { useState } from "react";
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
  // TODO: Replace with actual class code from backend
  const classCode = "ABC123";

  const handleCopy = () => {
    navigator.clipboard.writeText(classCode);
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
          <div className="flex items-center justify-center space-x-2">
            <div className="text-2xl font-bold bg-white/10 px-4 py-2 rounded-md text-white">
              {classCode}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-10 w-10 text-white hover:bg-white/10"
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
