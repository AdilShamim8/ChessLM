import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Monitor, Brain, Heart } from 'lucide-react';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import PlayerSelector from '@/components/PlayerSelector';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <SiteHeader />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center bg-gradient-to-b from-background to-background/90">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-center">
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
        <section id="features" className="w-full py-20 md:py-32 bg-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Platform Features
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full mb-8" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="bg-background/40 border-border/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/50 flex flex-col h-full group">
                <CardHeader className="flex flex-col items-center pt-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2 text-center">Multiple AI Engines</CardTitle>
                  <CardDescription className="text-center text-gray-400 max-w-[250px]">
                    Play against OpenAI, Anthropic, Gemini, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground pb-10 px-8 flex-1 flex items-center">
                  Test your skills against the most advanced LLMs with varying reasoning capabilities and strategic depths.
                </CardContent>
              </Card>

              <Card className="bg-background/40 border-border/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/50 flex flex-col h-full group">
                <CardHeader className="flex flex-col items-center pt-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2 text-center">Real-time Analysis</CardTitle>
                  <CardDescription className="text-center text-gray-400 max-w-[250px]">
                    Get instant feedback on your strategic moves.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground pb-10 px-8 flex-1 flex items-center">
                  Receive detailed engine evaluations and learn from your mistakes as you play in a pro-grade environment.
                </CardContent>
              </Card>

              <Card className="bg-background/40 border-border/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:border-primary/50 flex flex-col h-full group">
                <CardHeader className="flex flex-col items-center pt-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Monitor className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2 text-center">Sleek Interface</CardTitle>
                  <CardDescription className="text-center text-gray-400 max-w-[250px]">
                    Distraction-free focus on your chess game.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground pb-10 px-8 flex-1 flex items-center">
                  Enjoy a minimalist, beautiful, and fully responsive chessboard designed for elite strategic focus.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Models Section */}
        <section id="models" className="w-full py-20 md:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                AI Models Performance
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full mb-8" />
              <p className="max-w-[700px] text-gray-400 text-lg font-light mb-12">
                Comparative analysis of model performance in real Chess matches.
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-xl border border-border/50 bg-secondary/10 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-secondary/40 text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="px-6 py-4 font-bold">Model</th>
                      <th className="px-6 py-4 font-bold">Provider</th>
                      <th className="px-6 py-4 font-bold text-center">Est. Elo</th>
                      <th className="px-6 py-4 font-bold text-right">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> GPT-4o
                      </td>
                      <td className="px-6 py-4 text-gray-400">OpenAI</td>
                      <td className="px-6 py-4 text-center font-mono text-primary">2850</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-bold">68%</span>
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '68%' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" /> Claude 3.5 Sonnet
                      </td>
                      <td className="px-6 py-4 text-gray-400">Anthropic</td>
                      <td className="px-6 py-4 text-center font-mono text-primary">2900</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-bold">72%</span>
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '72%' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Gemini Pro 1.5
                      </td>
                      <td className="px-6 py-4 text-gray-400">Google</td>
                      <td className="px-6 py-4 text-center font-mono text-primary">2780</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-bold">64%</span>
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '64%' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" /> Grok-2
                      </td>
                      <td className="px-6 py-4 text-gray-400">xAI</td>
                      <td className="px-6 py-4 text-center font-mono text-primary">2820</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-bold">66%</span>
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '66%' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-20 md:py-32 bg-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                About ChessLM
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full mb-8" />
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                <p>
                  At ChessLM, we are on a mission to push the boundaries of Artificial Intelligence. While Large Language Models (LLMs) have mastered human language, their ability to reason, plan, and execute strategy in a zero-luck environment like Chess remains the ultimate litmus test for Artificial General Intelligence (AGI).
                </p>
                <p className="bg-white/5 p-6 rounded-2xl border border-white/10 text-white font-medium">
                  We want to test AI model capabilities by evaluating their chess strategy, tactical awareness, and decision-making depth in real-time matches against humans and each other.
                </p>
                <p>
                  Every game played on this platform contributes to our data-driven understanding of how different neural architectures approach complex combinatorial problems. Whether you are a Grandmaster or a beginner, your matches provide valuable insights into the current state of AI reasoning.
                </p>
              </div>
              <div className="mt-12 flex gap-4">
                <Link href="/game">
                  <Button className="px-10 py-6 text-lg rounded-full">Play Now</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="px-10 py-6 text-lg rounded-full bg-transparent">Explore Features</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-4 py-8 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by <Link href="https://ovishekh.com" className="hover:text-primary transition-colors font-medium">Ovi Shekh</Link>
        </p>
        <nav className="flex gap-2 items-center text-xs text-muted-foreground">
          <Link className="hover:text-primary transition-colors" href="https://www.ovishekh.com/privacypolicy">
            Privacy
          </Link>
          <span>.</span>
          <Link className="hover:text-primary transition-colors" href="https://www.ovishekh.com/terms">
            Terms
          </Link>
          <span>.</span>
          <Link className="hover:text-primary transition-colors font-medium" href="https://www.ovishekh.com/call">
            Work with Ovi
          </Link>
        </nav>
      </footer>
    </div>
  );
}
