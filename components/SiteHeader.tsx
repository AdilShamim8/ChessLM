"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
                <div className="mr-4 flex">
                    <Link className="flex items-center justify-center gap-2 mr-6" href="/">
                        <Image
                            src="/logo.png"
                            width={32}
                            height={32}
                            alt="ChessLM Logo"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-xl tracking-tight text-white">
                            ChessLM
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium hidden lg:flex">
                        <Link
                            href="#features"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Features
                        </Link>
                        <Link
                            href="#models"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Models
                        </Link>
                        <Link
                            href="#about"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            About
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <Link
                        href="https://github.com/ovishkh/ChessLM"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 hover:bg-secondary/50 rounded-full transition-colors group"
                    >
                        <Github className="h-5 w-5 text-foreground/60 group-hover:text-white transition-colors" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 px-0 lg:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="container pb-4 bg-background/95 backdrop-blur">
                    <nav className="flex flex-col space-y-3 px-4">
                        <Link
                            href="#features"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="#models"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Models
                        </Link>
                        <Link
                            href="#about"
                            className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
