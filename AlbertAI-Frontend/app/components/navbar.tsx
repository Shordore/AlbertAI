"use client";

import { Button } from "@/components/ui/button";
import { Bot, Menu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react"; // Added import for React

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-[#1E40AF]" />
        <span className="text-white font-medium text-xl">AlbertAI</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/how-it-works">How it Works</NavLink>
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/examples">Study Modes</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-white hover:text-[#1E40AF] rounded hover:bg-white"
        >
          Sign In
        </Button>
        <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white rounded">
          Join Class
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1E40AF] transition-all group-hover:w-full" />
    </Link>
  );
}
