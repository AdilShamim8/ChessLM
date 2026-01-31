import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Monitor, Brain } from 'lucide-react';
import Image from 'next/image';
import PlayerSelector from '@/components/PlayerSelector';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link className="flex items-center justify-center gap-2" href="#">
          <Image src="/rook.png" width={24} height={24} alt="ChessLM Logo" className="w-6 h-6 object-contain" />
          <span className="font-bold text-xl tracking-tight text-white">ChessLM</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            AI Models
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            About
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center bg-gradient-to-b from-background to-background/90">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Master Chess with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl font-light">
                  Challenge the world&apos;s most advanced language models in the ultimate test of strategy.
                </p>
              </div>

              {/* Game Setup Section */}
              <div className="w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PlayerSelector />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="bg-background/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <Brain className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Multiple AI Engines</CardTitle>
                  <CardDescription>
                    Play against OpenAI, Anthropic, Gemini, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Test your skills against different LLM reasoning capabilities.
                </CardContent>
              </Card>
              <Card className="bg-background/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <Zap className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Real-time Analysis</CardTitle>
                  <CardDescription>
                    Get instant feedback on your moves.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Learn from your mistakes with detailed engine evaluation.
                </CardContent>
              </Card>
              <Card className="bg-background/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <Monitor className="w-10 h-10 mb-2 text-primary" />
                  <CardTitle>Sleek Interface</CardTitle>
                  <CardDescription>
                    Distraction-free environment for pure focus.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Enjoy a beautiful, responsive board designed for pros.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 ChessLM. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
