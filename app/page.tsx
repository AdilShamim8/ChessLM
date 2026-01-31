import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Monitor, Brain, Heart } from 'lucide-react';
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
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center bg-gradient-to-b from-background to-background/90">
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
              <Card className="bg-background/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Brain className="w-12 h-12 mb-4 text-primary" />
                  </div>
                  <CardTitle>Multiple AI Engines</CardTitle>
                  <CardDescription>
                    Play against OpenAI, Anthropic, Gemini, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Test your skills against different LLM reasoning capabilities.
                </CardContent>
              </Card>
              <Card className="bg-background/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Zap className="w-12 h-12 mb-4 text-primary" />
                  </div>
                  <CardTitle>Real-time Analysis</CardTitle>
                  <CardDescription>
                    Get instant feedback on your moves.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Learn from your mistakes with detailed engine evaluation.
                </CardContent>
              </Card>
              <Card className="bg-background/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Monitor className="w-12 h-12 mb-4 text-primary" />
                  </div>
                  <CardTitle>Sleek Interface</CardTitle>
                  <CardDescription>
                    Distraction-free environment for pure focus.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Enjoy a beautiful, responsive board designed for pros.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-4 py-8 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by <Link href="https://ovishekh.com" className="hover:text-primary transition-colors font-medium">Ovi Shekh</Link>
        </p>
        <nav className="flex gap-2 items-center text-xs text-muted-foreground">
          <Link className="hover:text-primary transition-colors" href="#">
            Privacy
          </Link>
          <span>.</span>
          <Link className="hover:text-primary transition-colors" href="#">
            Terms
          </Link>
          <span>.</span>
          <Link className="hover:text-primary transition-colors font-medium" href="https://ovishekh.com">
            Work with Ovi
          </Link>
        </nav>
      </footer>
    </div>
  );
}
