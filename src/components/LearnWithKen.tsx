import React, { useState } from "react";
import {
  GraduationCap,
  Code,
  ShieldCheck,
  ArrowLeft,
  MagnifyingGlass
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LearnWithKenProps {
  className?: string;
}

interface LearningTile {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  category: string;
}

/**
 * Learn with Ken - Educational hub for coding best practices and tips
 * Features: Three-tile layout, expandable articles, consistent styling
 */
export const LearnWithKen: React.FC<LearnWithKenProps> = ({
  className,
}) => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const learningTiles: LearningTile[] = [
    {
      id: 'refactoring-why',
      title: 'Why Refactoring Matters',
      description: 'Keeping your code clean and organized so you can actually work with it later',
      icon: <Code className="h-6 w-6" weight="duotone" />,
      category: 'Fundamentals',
      content: `Look, Claude just generated you some code that works... so why mess with it?

Here's the thing. That AI-generated mess might work NOW, but good luck understanding it when you need to change something later. Refactoring is cleaning up AI output so you can actually work with it.

## What exactly is it?
Taking working AI code and making it readable. Same functionality, way less confusion when you need to modify it.

## Why bother when AI wrote it?

You're going to need to CHANGE that code eventually. AI doesn't know your specific needs. When you need to add features or fix bugs, clean code saves your sanity.

Also... you're the one who has to explain it to your team. "Claude wrote it" isn't helpful when something breaks.

## When to clean up AI code

Right after AI generates it. Don't let messy AI code pile up.

Before asking AI to add more features to existing code. Clean foundation first.

When you look at the AI output and think "this is way too complicated for what it does."

## Working with AI effectively:
Ask for simpler solutions when AI goes overboard. Tell it to use clear variable names. Ask it to break complex functions into smaller ones. And always ask WHY it chose that approach.`
    },
    {
      id: 'git-commits',
      title: 'Git & Commits Made Simple',
      description: 'When to save your work and why it matters for not losing your progress',
      icon: <ShieldCheck className="h-6 w-6" weight="duotone" />,
      category: 'Tools',
      content: `Git is your safety net when working with AI code. You know when Claude generates something and you think "this might break everything"? Save first.

## When to commit with AI coding

After AI generates working code. Even if it's messy, it WORKS. Save that state.

Before asking AI to modify existing code. You want to be able to go back if AI makes things worse.

End of each coding session. Even if the AI code isn't perfect... commit it. Better than losing progress.

## Writing commit messages for AI work

Be honest about what happened:
- "Add login with Claude's help"
- "Claude fixed the mobile button issue"
- "AI generated user dashboard, needs cleanup"

NOT vague nonsense:
- "Implement comprehensive enhancements"
- "Leverage AI-driven optimizations"

Just say what you actually got done.

## Why this matters with AI coding

You're going to want to try different AI approaches. Good commits let you experiment fearlessly.

When AI breaks something (and it will), you can pinpoint exactly when things went wrong.

Working with a team? They need to know what AI generated vs what you modified. Be clear about it.

## Real talk:
Commit after every successful AI generation. Write messages that explain what you asked for and what you got. Don't commit broken AI output unless you mark it as broken.`
    },
    {
      id: 'typechecking-linting',
      title: 'TypeChecking & Linting',
      description: 'Tools that catch your mistakes before they become embarrassing bugs',
      icon: <GraduationCap className="h-6 w-6" weight="duotone" />,
      category: 'Quality',
      content: `You know that feeling when you spend 2 hours debugging only to find you misspelled a variable name? Yeah... these tools prevent that.

## TypeChecking
It's basically spell check for code. Catches dumb mistakes like calling functions that don't exist or mixing up data types.

Say you write a function expecting a number but someone passes text. TypeScript will yell at you BEFORE your app crashes. Pretty useful.

## Linting
Code style police. Makes sure everyone on your team writes code the same way. No more arguments about spaces vs tabs.

## Why you should actually care

Ever worked on someone else's messy code? It sucks. These tools make sure YOUR code doesn't suck for the next person.

Also catches mistakes instantly instead of letting them become bugs that users find. Much less embarrassing.

## Getting started

TypeScript if you're using JavaScript. Yes it feels like extra work at first. No you won't regret it later.

ESLint for catching mistakes and keeping things consistent. Will feel annoying for about a week then you'll love it.

Prettier so your code always looks clean without thinking about it.

## Bottom line
Set them up once and forget about them. They'll save you from so many stupid mistakes you won't even know about.`
    },
    {
      id: 'coding-principles',
      title: 'Coding Principles (KISS, YAGNI & More)',
      description: 'The rules that keep your code from becoming an unreadable mess',
      icon: <GraduationCap className="h-6 w-6" weight="duotone" />,
      category: 'Principles',
      content: `AI tools love to overcomplicate things. They're like that friend who suggests a 47-ingredient recipe when you just want scrambled eggs. Here's how to keep things sane.

## KISS - Keep It Simple, Stupid

**What It Means:**
The simplest solution that works is usually the best one. Not the cleverest, not the most impressive - just simple.

**Why It Matters:**
Complex code breaks more often. It's like a Rube Goldberg machine - impressive, but one domino falls wrong and the whole thing's screwed.

**Real Talk:**
When Claude suggests a super fancy solution with 17 helper functions, ask yourself: "Do I really need all this?" Usually, the answer is no.

## YAGNI - You Aren't Gonna Need It

**What It Means:**
Don't build features "just in case." Build what you need right now.

**The Problem:**
AI loves to say "What if we also add..." Stop. You probably won't need it, and if you do, you can add it later.

**Example:**
Building a login page? Don't also build password reset, two-factor auth, and social login "just in case." Build login. Add the rest when users actually ask for it.

## DRY - Don't Repeat Yourself

**What It Means:**
If you're copying and pasting code, you're doing it wrong.

**Think About It:**
When you have the same recipe in 5 different cookbooks, updating it becomes a nightmare. Same with code.

**How to Fix:**
Create a function. Use it everywhere. Change it once, it changes everywhere.

## Single Responsibility Principle

**What It Means:**
Each function should do one thing well. Like a good kitchen knife - it cuts things. It doesn't also open cans and play music.

**AI's Problem:**
LLMs love creating super-functions that do everything. "Here's a function that validates email, sends notifications, logs activity, and makes coffee." No. Just... no.

## Why This Matters More Than Ever

**AI Overengineering**
Claude, ChatGPT, and others love showing off. They'll suggest enterprise-level solutions for a simple blog. It's like using a sledgehammer to crack a nut.

**You're The Boss**
Just because AI suggests something complex doesn't mean it's better. You know your project. Keep it simple.

**Maintenance Hell**
That fancy AI-generated code? Good luck maintaining it in 6 months when you've forgotten how it works.

## Bottom Line
Simple code is:
- Easier to understand
- Easier to fix
- Easier to change
- Less likely to break

When AI suggests something that makes you go "huh?", ask for simpler. Your future self will thank you.`
    },
    {
      id: 'prompt-engineering',
      title: 'Prompting Coding Agents Right',
      description: 'How to get Claude Code and other AI agents to build exactly what you want',
      icon: <GraduationCap className="h-6 w-6" weight="duotone" />,
      category: 'AI Skills',
      content: `Working with coding agents is different from chatting. Here's how to get Claude Code to actually build what you want instead of going off on tangents.

## Coding agents vs chat AI

Chat AI gives you advice. Coding agents DO the work. Huge difference in how you need to prompt them.

With Claude Code, you're not asking for help... you're giving instructions for what to build.

## The setup that gets you results

Start with the full picture. "Build me a todo app with React. I want add/delete/mark complete. No fancy features. Make it look clean but simple."

Tell it about your existing setup. "I already have a React project running. Add this to the existing App.js file."

Be clear about constraints. "Don't use any external libraries except what's already installed."

## What works specifically for coding agents

Give it the GOAL, not the method. "I want users to be able to upload images" not "create an image upload component with drag and drop and preview."

Mention your deployment target. "This needs to work on Vercel" or "This is just running locally."

Tell it about your data. "User data is stored in localStorage" or "I'm using a simple JSON file for now."

## The magic prompts for coding agents

"Build this step by step, test after each step"
"Keep it minimal, I'll ask for more features later"
"Don't optimize yet, just make it work"
"Show me exactly which files you're changing"

## For lazy people who want results

Use this template:

"Build [what you want] using [your tech stack]. Make it [simple/minimal]. I want it to [specific function]. Don't worry about [advanced features]. My setup: [describe current project]."

Then let the agent work and only interrupt if it goes crazy with complexity.`
    },
    {
      id: 'context-engineering',
      title: 'Context Engineering (Game Changer)',
      description: 'Feed your coding agent the right docs so it builds with actual best practices',
      icon: <GraduationCap className="h-6 w-6" weight="duotone" />,
      category: 'AI Skills',
      content: `Context engineering is giving your coding agent the documentation it needs to build things RIGHT instead of just making stuff up.

## What it actually is

You know how Claude Code sometimes generates code that works but isn't following best practices? That's because it's guessing. Context engineering means feeding it the ACTUAL documentation first.

## Real examples that work

Building with Pydantic? Paste the Pydantic docs into your prompt. Now Claude builds with proper Pydantic patterns instead of generic Python.

Using Next.js? Give it the latest Next.js best practices guide. Suddenly it's building with App Router and proper file structure.

Working with a specific API? Feed it that API's documentation. No more guessing about parameter names.

## Why this is a game changer

Instead of getting generic code that "works," you get code that follows the actual recommended patterns for whatever you're using.

Your AI agent becomes an expert in YOUR stack instead of just giving you basic solutions.

Less time fixing AI mistakes because it's building things the right way from the start.

## The smart ways to deliver context

**MD files in your project**
Create a docs folder with markdown files explaining your project structure, coding standards, and patterns. Your agent reads these automatically.

**Web search integration**
Let your agent search for current documentation itself. "Search for Next.js 15 App Router best practices and use those patterns."

**MCP tools like Context7**
Install MCP tools that give your agent access to specific documentation libraries. Way more powerful than manual pasting.

**Reference repositories**
Point your agent to existing codebases that follow the patterns you want. "Build this similar to how it's done in [repo link]."

## Setting up proper context

Put project documentation in a /docs folder. Include coding standards, architecture decisions, and patterns you want followed.

Use MCP servers for frameworks you work with often. Context7 MCP gives agents access to comprehensive documentation libraries.

Create reference files showing "good" vs "bad" examples for your project.

## For the lazy but smart

Install Context7 MCP once, get access to tons of documentation automatically.

Create one markdown file with your project's patterns and standards. Agent references it for every request.

Use web search when you need current docs. "Search for the latest Pydantic patterns and build with those."

## Bottom line

Proper context setup takes 10 minutes once but saves hours on every request. Your agent builds things right the first time instead of you fixing generic garbage later.`
    }
  ];

  const selectedTileData = learningTiles.find(tile => tile.id === selectedTile);

  // Filter tiles based on search query
  const filteredTiles = learningTiles.filter(tile =>
    tile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tile.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tile.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Article view
  if (selectedTile && selectedTileData) {
    return (
      <div className={cn("h-full overflow-y-auto", className)}>
        <div className="max-w-6xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading-1">{selectedTileData.title}</h1>
                <p className="mt-1 text-body-small text-muted-foreground">
                  {selectedTileData.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTile(null)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" weight="duotone" />
                Back to Learn
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-0">
            <Card className="p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {selectedTileData.content}
                </ReactMarkdown>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main tile grid view
  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">Learn with Ken</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                Essential coding knowledge, best practices, and pro tips
              </p>
            </div>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" weight="duotone" />
              <Input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTiles.map((tile) => (
              <Card
                key={tile.id}
                className="p-6 h-full cursor-pointer transition-all border-border/50 hover:border-accent"
                onClick={() => setSelectedTile(tile.id)}
              >
                  <div className="flex flex-col h-full">
                    <h3 className="text-heading-4 mb-2">{tile.title}</h3>
                    <p className="text-body-small text-muted-foreground">
                      {tile.description}
                    </p>
                  </div>
                </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-caption text-muted-foreground">
              More learning content coming soon! Each tile contains practical knowledge for better coding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};