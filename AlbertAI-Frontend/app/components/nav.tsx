import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white">ResearchAI</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
          How it Works
        </Link>
        <Link href="#examples" className="text-gray-300 hover:text-white transition-colors">
          Examples
        </Link>
        <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Sign In
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
      </div>
    </nav>
  )
}

