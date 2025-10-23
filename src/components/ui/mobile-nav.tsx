'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Bot, 
  Image as ImageIcon, 
  Search, 
  Code, 
  Mic, 
  FileText, 
  BarChart3, 
  Globe,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
  IndianRupee,
  ChevronDown
} from 'lucide-react';

interface MobileNavProps {
  user?: any;
  onAuthClick: () => void;
}

export function MobileNav({ user, onAuthClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const tools = [
    { href: '/chat', label: 'AI Chat', icon: <Bot className="h-4 w-4" /> },
    { href: '/image-generation', label: 'Image Generation', icon: <ImageIcon className="h-4 w-4" /> },
    { href: '/web-search', label: 'Web Search', icon: <Search className="h-4 w-4" /> },
    { href: '/playground', label: 'AI Playground', icon: <Sparkles className="h-4 w-4" /> },
    { href: '/file-processing', label: 'File Processing', icon: <FileText className="h-4 w-4" /> },
    { href: '/functions', label: 'Function Calling', icon: <Code className="h-4 w-4" /> },
    { href: '/code-tools', label: 'Code Tools', icon: <Code className="h-4 w-4" /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { href: '/voice-recognition', label: 'Voice Recognition', icon: <Mic className="h-4 w-4" /> },
    { href: '/content-moderation', label: 'Content Moderation', icon: <Shield className="h-4 w-4" /> },
    { href: '/personalization', label: 'Personalization', icon: <Users className="h-4 w-4" /> },
    { href: '/translation', label: 'Translation', icon: <Globe className="h-4 w-4" /> },
    { href: '/multimodal', label: 'Multimodal AI', icon: <Zap className="h-4 w-4" /> },
  ];

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/api', label: 'API' },
    { href: '/docs', label: 'Documentation' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            IndiGLM
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-6">
          {/* Main Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Tools Section */}
          <div className="space-y-2">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              <span>Tools</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {toolsOpen && (
              <div className="ml-4 space-y-1">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                  >
                    {tool.icon}
                    {tool.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="space-y-3 pt-4 border-t">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onAuthClick();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start px-3 py-2 text-base font-medium hover:bg-muted"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onAuthClick();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start px-3 py-2 text-base font-medium hover:bg-muted"
                >
                  Sign In
                </Button>
              </>
            )}
            <Button
              asChild
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              <Link href={user ? "/dashboard" : "/dashboard"}>
                {user ? "Dashboard" : "Explore Dashboard"}
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium">Quick Stats</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                22+ Languages
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                &lt;500ms Response
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                99.9% Uptime
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                94% Cultural AI
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}