import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { SparklesCore } from "@/components/sparkles-core";
import { FloatingPaper } from "@/components/floating-paper";
import { RoboAnimation } from "@/components/robo-animation";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <SparklesCore
        id="tsparticles"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="fixed inset-0 pointer-events-none"
        particleColor="#FFFFFF"
      />
      <FloatingPaper count={4} />
      <Navbar />

      <div className="relative pt-64 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Transform Your Learning with{" "}
            <span className="gradient-text">AI Power</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            Upload your class materials and let AI generate interactive study
            activities to help you master the content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-lg px-8 py-6 rounded"
            >
              <Link href="/professor-onboarding">Upload Study Materials</Link>
            </Button>
            <Button
              variant="outline"
              className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-100 rounded"
            >
              Explore Study Modes
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 p-8 w-48 h-48">
          <RoboAnimation />
        </div>
      </div>
    </main>
  );
}
