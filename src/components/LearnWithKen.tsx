import React, { useState } from "react";
import {
  GraduationCap,
  Code,
  ShieldCheck,
  MagnifyingGlass,
  Globe
} from "@phosphor-icons/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
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

## Real example of messy AI code

**What Claude generates:**
\`\`\`javascript
function processUserData(data) {
  const result = data.map(x => ({...x, active: x.status === 'active' ? true : false, displayName: x.firstName + ' ' + x.lastName, isAdmin: x.role === 'admin' ? true : x.role === 'superadmin' ? true : false}));
  return result;
}
\`\`\`

**After refactoring:**
\`\`\`javascript
function processUserData(users) {
  return users.map(user => ({
    ...user,
    active: user.status === 'active',
    displayName: \`\${user.firstName} \${user.lastName}\`,
    isAdmin: ['admin', 'superadmin'].includes(user.role)
  }));
}
\`\`\`

See the difference? Same result, way more readable.

## When to clean up AI code

Right after AI generates it. Don't let messy AI code pile up.

Before asking AI to add more features to existing code. Clean foundation first.

When you look at the AI output and think "this is way too complicated for what it does."

## How to get AI to refactor for you

**Instead of accepting messy code, prompt:**
"Refactor this code to be more readable. Use clear variable names and break it into smaller functions."

**For specific improvements:**
"This function does too much. Split it into separate functions with clear names."

**When AI uses cryptic names:**
"Rename variables to be more descriptive. Use full words, not abbreviations."

**Example prompt:**
"Here's the code you generated: [paste code]. Make it cleaner and easier to understand. Use descriptive names and split complex logic into smaller parts."

## Common AI code smells to watch for

**Single-letter variables everywhere:**
Tell AI: "Use descriptive variable names instead of x, y, z"

**Functions doing 10 things:**
Tell AI: "Break this function into smaller, focused functions"

**Nested ternaries:**
Tell AI: "Replace nested ternaries with if statements or switch cases"

**Magic numbers:**
Tell AI: "Replace magic numbers with named constants"

## Quick refactoring checklist

After AI generates code, ask yourself:
- Can I understand what it does in 10 seconds?
- Are variable names clear?
- Is each function doing just ONE thing?
- Would I be embarrassed to show this code to someone?

If any answer is no, prompt AI to clean it up.

## Working with AI effectively

**Ask for simpler solutions when AI goes overboard:**
"This is too complex. Give me a simpler version that's easier to understand."

**Tell it to use clear variable names:**
"Use descriptive variable names. No single letters unless it's a loop counter."

**Ask it to break complex functions into smaller ones:**
"Split this into smaller functions. Each should do one clear thing."

**Always ask WHY it chose that approach:**
"Why did you implement it this way? Is there a simpler approach?"

## Bottom line

Clean code = code you can actually work with later. Don't accept messy AI output. Make it refactor until the code makes sense at a glance. Your future self will thank you.`
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

## Basic git commands you actually need

**Check what changed:**
\`\`\`bash
git status
\`\`\`
Shows which files AI modified.

**Save your work:**
\`\`\`bash
git add .
git commit -m "Your message here"
\`\`\`

**Go back if AI broke things:**
\`\`\`bash
git log  # Find the commit you want
git checkout [commit-hash]  # Go back to that version
\`\`\`

**Or just undo the last commit:**
\`\`\`bash
git reset --soft HEAD~1  # Keeps the changes, undoes commit
git reset --hard HEAD~1  # Deletes everything (careful!)
\`\`\`

## Writing commit messages for AI work

Be honest about what happened:
- "Add login with Claude's help"
- "Claude fixed the mobile button issue"
- "AI generated user dashboard, needs cleanup"
- "WIP: Claude building search feature, not working yet"

NOT vague nonsense:
- "Implement comprehensive enhancements"
- "Leverage AI-driven optimizations"
- "Update files"

Just say what you actually got done.

## Real workflow example

**You:** "Claude, add a user profile page"

**Claude generates code...**

**You commit:**
\`\`\`bash
git add .
git commit -m "Add user profile page with Claude - shows username and email"
\`\`\`

**You:** "Claude, add profile picture upload"

**Claude breaks something...**

**You rollback:**
\`\`\`bash
git reset --hard HEAD~1  # Back to working version
\`\`\`

Try again with clearer instructions.

## How to ask AI to use git

**Basic commits:**
"After you make these changes, show me the git commands to commit them."

**Creating commits directly:**
"Make these changes and create a git commit with an appropriate message."

**When experimenting:**
"I want to try something risky. Show me how to create a git branch first so I can experiment safely."

## Why this matters with AI coding

You're going to want to try different AI approaches. Good commits let you experiment fearlessly.

When AI breaks something (and it will), you can pinpoint exactly when things went wrong.

Working with a team? They need to know what AI generated vs what you modified. Be clear about it.

## Commit frequently with AI

**Bad approach:**
Work with AI for 3 hours, make one giant commit, can't undo individual changes.

**Good approach:**
Commit after each working feature. If something breaks, you know exactly which change did it.

**Example flow:**
1. AI adds login form → commit
2. AI adds validation → commit
3. AI connects to API → commit
4. AI breaks everything → rollback last commit, still have working validation

## Using branches for big AI experiments

When trying something major, use a branch:

\`\`\`bash
git checkout -b try-new-approach
\`\`\`

Now AI can experiment freely. If it works, merge it. If it fails, just switch back to main.

\`\`\`bash
git checkout main  # Back to safety
\`\`\`

**Prompt for AI:**
"I'm on a feature branch. Help me implement this experimental approach. If it works, I'll merge it to main."

## Real talk

Commit after every successful AI generation. Write messages that explain what you asked for and what you got.

Don't commit broken AI output unless you mark it clearly: "WIP: broken search feature, AI debugging"

Think of commits as save points in a game. The more save points, the less you lose when something goes wrong.

## Bottom line

Git = undo button for AI coding. Commit often, write clear messages, don't be afraid to rollback when AI messes up. Better to lose 10 minutes of work than 3 hours.`
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

**Real example:**
\`\`\`javascript
// JavaScript - no error until runtime
function calculatePrice(price, quantity) {
  return price * quantity;
}

calculatePrice("10", 2);  // Returns "1010" instead of 20. Bug!
\`\`\`

\`\`\`typescript
// TypeScript - catches it immediately
function calculatePrice(price: number, quantity: number): number {
  return price * quantity;
}

calculatePrice("10", 2);  // ERROR: string is not assignable to number
\`\`\`

TypeScript saved you before users found the bug.

## Linting
Code style police. Makes sure everyone on your team writes code the same way. No more arguments about spaces vs tabs.

**What ESLint catches:**
- Unused variables
- Missing return statements
- Comparing with == instead of ===
- Functions that are too complex
- Undefined variables

**Example:**
\`\`\`javascript
function login(user) {
  const token = generateToken(user);
  const session = createSession(user);
  // Forgot to return anything!
}
\`\`\`

ESLint: "⚠️ Function should return a value"

## Getting AI to set these up

**For TypeScript:**
"Set up TypeScript in this project. Configure it for strict type checking and show me how to run the type checker."

**For ESLint:**
"Add ESLint to this project with recommended rules. Include rules for React if I'm using React."

**For Prettier:**
"Set up Prettier with ESLint integration. Make it format on save."

**All at once:**
"Set up TypeScript, ESLint, and Prettier in this project. Use strict settings and make them work together."

## Why you should actually care

Ever worked on someone else's messy code? It sucks. These tools make sure YOUR code doesn't suck for the next person.

Also catches mistakes instantly instead of letting them become bugs that users find. Much less embarrassing.

## Real workflow with AI

**You:** "Claude, add a search function"

**Claude generates code...**

**TypeScript errors:**
\`\`\`
Property 'query' does not exist on type '{}'
\`\`\`

**You to Claude:** "Fix the TypeScript errors"

**Claude adds proper types and it works.**

This happens BEFORE you test manually. Saves tons of time.

## How to use these tools

**Check for errors:**
\`\`\`bash
npm run type-check  # TypeScript
npm run lint  # ESLint
\`\`\`

**Fix auto-fixable issues:**
\`\`\`bash
npm run lint -- --fix
\`\`\`

**Tell AI to follow the rules:**
"Make sure this code passes TypeScript and ESLint checks. Fix any errors."

## Getting started

**TypeScript if you're using JavaScript:**
Yes it feels like extra work at first. No you won't regret it later.

**Prompt:**
"Convert this project to TypeScript. Add types to all functions and variables."

**ESLint for catching mistakes:**
Will feel annoying for about a week then you'll love it.

**Prompt:**
"Install ESLint with recommended rules. Make it catch common JavaScript mistakes."

**Prettier so code always looks clean:**
No more thinking about formatting.

**Prompt:**
"Set up Prettier to auto-format my code. Integrate it with ESLint."

## When AI code fails these checks

Don't just disable the errors. Tell AI to fix them properly.

**Bad:**
\`\`\`typescript
// @ts-ignore  ← Ignoring the problem
const data = somethingBroken();
\`\`\`

**Good:**
"This code has TypeScript errors. Fix them properly with correct types."

## Common AI mistakes these tools catch

**Missing types:**
AI generates JavaScript when you need TypeScript.

**Unused variables:**
AI creates variables it never uses.

**Wrong return types:**
AI says function returns string, actually returns number.

**Inconsistent formatting:**
AI uses 2 spaces in one file, 4 in another.

## Pro tips for vibe coders

Run these checks before committing code. Saves embarrassment.

Tell AI upfront: "Make sure all code passes TypeScript and ESLint"

If you get 50 errors, don't panic. Copy them all to AI: "Fix these errors"

Set up your editor to show errors as you type. Catch issues instantly.

## What to do about warnings

**Errors = must fix:**
Code won't work or will break.

**Warnings = should fix:**
Code works but isn't ideal. Fix them or tech debt piles up.

**Prompt for AI:**
"Fix all ESLint errors and warnings in this code. Explain what each fix does."

## Bottom line

Set them up once and forget about them. They'll save you from so many stupid mistakes you won't even know about. Tell AI to set them up in every project. Make AI fix all errors before you accept the code. Your code will be way better.`
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

**Real example:**
**You:** "Build a todo app"

**AI suggests:** Full Redux store, sagas, normalized database, authentication, real-time sync, offline mode, undo/redo...

**You should ask for:** "Simple todo app. Array of items. Add, delete, done checkbox. Just useState."

**Real Talk:**
When Claude suggests a super fancy solution with 17 helper functions, ask yourself: "Do I really need all this?" Usually, the answer is no.

**How to prompt for KISS:**
"Keep this as simple as possible. No fancy patterns or libraries."
"Build the dumbest version that works. I'll optimize later."
"Don't add features I didn't ask for."

## YAGNI - You Aren't Gonna Need It

**What It Means:**
Don't build features "just in case." Build what you need right now.

**The Problem:**
AI loves to say "What if we also add..." Stop. You probably won't need it, and if you do, you can add it later.

**Bad AI suggestion:**
\`\`\`
Building a login page? Let me also add:
- Password reset
- Email verification
- Two-factor authentication
- Social login (Google, Facebook, Twitter)
- Remember me
- Session timeout
- Rate limiting
Just in case!
\`\`\`

**What you actually need:**
\`\`\`
Username and password form
Check if credentials match
That's it.
\`\`\`

**How to prompt for YAGNI:**
"Just build basic login. Username, password, done. No extra features."
"Don't add anything I didn't specifically ask for."
"When it works, stop. I'll tell you if I need more."

## DRY - Don't Repeat Yourself

**What It Means:**
If you're copying and pasting code, you're doing it wrong.

**Bad (repeated code):**
\`\`\`javascript
// Button for user
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  User Settings
</button>

// Same button for admin
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Admin Panel
</button>

// Same button for logout
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Logout
</button>
\`\`\`

**Good (reusable component):**
\`\`\`javascript
function Button({ children }) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}

<Button>User Settings</Button>
<Button>Admin Panel</Button>
<Button>Logout</Button>
\`\`\`

**How to prompt for DRY:**
"I see repeated code in these 3 places. Extract it into a reusable function."
"Create a component for this so I don't have to copy-paste."
"This logic appears multiple times. Make it a shared utility."

## Single Responsibility Principle

**What It Means:**
Each function should do one thing well. Like a good kitchen knife - it cuts things. It doesn't also open cans and play music.

**AI's Problem:**
LLMs love creating super-functions that do everything.

**Bad (does too much):**
\`\`\`javascript
function handleUserLogin(email, password) {
  validateEmail(email);
  hashPassword(password);
  checkDatabase(email, password);
  createSession();
  sendWelcomeEmail(email);
  logAnalytics('login');
  updateUserLastSeen();
  syncUserPreferences();
}
\`\`\`

**Good (each function does one thing):**
\`\`\`javascript
function validateCredentials(email, password) { }
function createUserSession(userId) { }
function sendWelcomeEmail(email) { }
function logUserLogin(userId) { }
\`\`\`

**How to prompt for this:**
"This function does too much. Split it into smaller functions."
"Break this into separate steps that each do one clear thing."
"Create focused functions instead of one giant function."

## Why This Matters More Than Ever

**AI Overengineering**
Claude, ChatGPT, and others love showing off. They'll suggest enterprise-level solutions for a simple blog. It's like using a sledgehammer to crack a nut.

**You're The Boss**
Just because AI suggests something complex doesn't mean it's better. You know your project. Keep it simple.

**Maintenance Hell**
That fancy AI-generated code? Good luck maintaining it in 6 months when you've forgotten how it works.

## Enforcing principles with AI

**In every prompt, add:**
"Follow KISS and YAGNI principles. Keep it simple."

**When reviewing code:**
"Is this as simple as it could be? Can we remove complexity?"

**When AI suggests features:**
"I didn't ask for that. Just build what I requested."

**Template prompt:**
"Build [feature]. Keep it minimal and simple. Don't add features I didn't ask for. Use the simplest approach that works."

## Bottom Line

Simple code is:
- Easier to understand
- Easier to fix
- Easier to change
- Less likely to break

When AI suggests something that makes you go "huh?", ask for simpler. Tell it upfront to follow these principles. Your future self will thank you.`
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

**Bad prompt:**
"Can you help me with a todo app?"

**Good prompt:**
"Build me a todo app with React. I want add/delete/mark complete. No fancy features. Make it look clean but simple."

**Why it works:**
- Tech stack specified (React)
- Exact features listed
- Clear constraints (no fancy features)
- Style guidance (clean but simple)

**Even better:**
"I already have a React project running. Add this to the existing App.js file. Don't install any new packages."

Now it knows the context and won't create unnecessary files.

## Real examples that work

**Example 1 - Image upload:**
❌ "Add image upload"
✅ "Add an image upload button. When clicked, let users select a file. Show a preview of the image below the button. Store the file in state."

**Example 2 - User list:**
❌ "Create a user management system"
✅ "Show a list of users from this array: [{name: 'John', email: 'john@example.com'}]. Display name and email in a simple table. Add a delete button for each user."

**Example 3 - API call:**
❌ "Connect to the API"
✅ "Fetch user data from /api/users on page load. Show a loading spinner while fetching. Display the users in a list when done. Show an error message if it fails."

## What works specifically for coding agents

**Give it the GOAL, not the method:**
❌ "Create an image upload component with drag and drop, preview, and file validation"
✅ "I want users to be able to upload images"

Let AI figure out the implementation. You specify what, not how.

**Mention your deployment target:**
"This needs to work on Vercel" or "This is just running locally"

Changes how AI handles file paths and environment variables.

**Tell it about your data:**
"User data is stored in localStorage" or "I'm using a simple JSON file for now"

Prevents AI from setting up a database you don't need.

## The magic prompts for coding agents

**For iterative development:**
"Build this step by step. Show me the first part, let me test it, then we'll add more."

**To prevent over-engineering:**
"Keep it minimal. I'll ask for more features later if I need them."

**To avoid premature optimization:**
"Don't optimize yet, just make it work. We can improve performance later."

**To track changes:**
"Show me exactly which files you're creating or modifying before you do it."

**To catch mistakes early:**
"After each change, show me how to test it."

## The lazy template that actually works

Fill in the blanks:

"Build [what you want] using [your tech stack]. Make it [simple/minimal]. I want it to [specific function]. Don't worry about [advanced features]. My setup: [describe current project]."

**Real example:**
"Build a search bar using React. Make it simple. I want it to filter this array of products by name as I type. Don't worry about sorting or advanced filters. My setup: I'm using Create React App, just the basic setup."

## Common mistakes that waste time

**Too vague:**
"Make a website" - AI has no idea what to build

**Too prescriptive:**
"Create a UserList component with these exact CSS classes and this specific folder structure..." - Just let AI do its thing

**No context:**
"Add login" when you haven't mentioned if you have a backend, database, or any auth setup

## The prompting framework

1. **What** you want built (specific)
2. **Tech stack** you're using
3. **Constraints** (keep it simple, don't use X, must work on Y)
4. **Context** about existing project
5. **Expected behavior** (what happens when user does X)

**Example using framework:**
1. What: "Add user authentication"
2. Stack: "Using React frontend, no backend yet"
3. Constraints: "Keep it simple, just store login state in localStorage"
4. Context: "I already have a Login component, add the logic to it"
5. Behavior: "When user enters username/password and clicks login, save {user: username} to localStorage and show 'Logged in' message"

## How to course-correct AI

**If AI goes off track:**
"Stop. This is too complex. I just need [simple version]."

**If AI adds features you didn't ask for:**
"I didn't ask for [feature]. Remove it and keep only [what I requested]."

**If you're confused:**
"Explain what you just built in simple terms. What does each file do?"

## Bottom line

Be specific about WHAT you want. Mention your tech stack. Set clear constraints. Provide context about your project. Then let AI figure out HOW to build it. Interrupt only if it overcomplicates things.`
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

**Without context:**
You: "Build a Pydantic model for a user"
AI: *generates generic Python class that sort of works*

**With context:**
You: "Here's the Pydantic v2 docs: [paste docs]. Now build a Pydantic model for a user"
AI: *generates proper Pydantic v2 model with correct validators, field types, and best practices*

## Real examples that work

**Example 1 - Pydantic:**
\`\`\`
Before: "Create a user model with validation"
Result: Generic Python class, missing Pydantic features

After: "Using Pydantic v2 docs, create a user model with email validation"
Result: Proper BaseModel, field validators, type hints, configuration
\`\`\`

**Example 2 - Next.js:**
\`\`\`
Before: "Add a new page"
Result: Uses old Pages Router, wrong file structure

After: "Using Next.js 15 App Router patterns, add a new page"
Result: Correct app/page.tsx structure, proper metadata, server components
\`\`\`

**Example 3 - API:**
\`\`\`
Before: "Connect to Stripe"
Result: AI guesses parameter names, gets auth wrong

After: "Here's the Stripe API docs for creating customers: [paste]. Implement customer creation"
Result: Correct endpoint, proper auth headers, right parameters
\`\`\`

## Why this is a game changer

Instead of getting generic code that "works," you get code that follows the actual recommended patterns for whatever you're using.

Your AI agent becomes an expert in YOUR stack instead of just giving you basic solutions.

Less time fixing AI mistakes because it's building things the right way from the start.

## How to deliver context effectively

**Method 1: Direct paste in prompt**
\`\`\`
"Here's the official documentation:

[paste relevant docs]

Now using these patterns, build [what you want]"
\`\`\`

Works for one-off requests when you need specific patterns.

**Method 2: Project docs folder**
Create \`/docs/patterns.md\`:
\`\`\`markdown
# Our Coding Patterns

## API Calls
Always use our custom fetcher: \`apiClient.get()\`
Never use raw fetch()

## Components
All components go in /components
Use TypeScript interfaces for props
Export as default

## Styling
Use Tailwind only
No inline styles
\`\`\`

Tell AI: "Follow the patterns in /docs/patterns.md"

**Method 3: Web search**
Let AI find current docs:
\`\`\`
"Search for Next.js 15 App Router best practices.
Then build a product page using those patterns."
\`\`\`

**Method 4: MCP tools**
Install Context7 or similar MCP servers:
\`\`\`
"Using Context7, lookup React 19 patterns.
Build a form component following those patterns."
\`\`\`

## Example prompts that use context

**For new frameworks:**
"I'm using Remix. Search for the latest Remix routing patterns. Build a route that loads user data and displays it."

**For APIs:**
"Here's the Notion API docs for creating pages: [paste]. Create a function that adds a new page to my Notion workspace."

**For project-specific patterns:**
"Read /docs/api-patterns.md. Now build a new API route following those exact patterns."

**For dependencies:**
"Show me the Zod documentation for object validation. Then create a user validation schema."

## Setting up proper context

**Create a docs folder:**
\`\`\`
/docs
  /patterns.md - Coding standards
  /architecture.md - How things are organized
  /examples.md - Good vs bad examples
\`\`\`

**Write clear patterns:**
\`\`\`markdown
Good:
function getUserData(id: string) {
  return apiClient.get(\`/users/\${id}\`)
}

Bad:
function getUserData(id) {
  return fetch('/users/' + id)
}
\`\`\`

**Tell AI to use them:**
"Before building anything, read all files in /docs and follow those patterns."

## For specific tech stacks

**Next.js project:**
"Use Next.js 15 App Router. Server components by default. Client components only when needed. Follow the official Next.js patterns."

**React + TypeScript:**
"Use React 19 patterns. All components typed with TypeScript. Props as interfaces. Follow official React docs."

**Python + FastAPI:**
"Use FastAPI patterns from the official docs. Pydantic models for validation. Async endpoints. Proper dependency injection."

## The MCP advantage

**Install Context7 once:**
Gives AI access to documentation for major frameworks automatically.

**Example with MCP:**
"Using Context7, get the latest Tailwind CSS patterns for forms. Build a contact form following those patterns."

AI fetches docs, understands current best practices, builds correctly.

## Common context mistakes

**Too much context:**
Pasting entire documentation (AI gets overwhelmed)

**Too little context:**
"Use best practices" (AI doesn't know which practices)

**Outdated context:**
Pasting old docs (AI builds with deprecated patterns)

**Sweet spot:**
Paste the specific section relevant to your task. 50-200 lines max.

## Real workflow example

**You want to build:** Stripe payment form

**Step 1 - Get context:**
Go to Stripe docs, find "Create Payment Intent" section, copy it.

**Step 2 - Provide context:**
"Here's the Stripe docs for creating payment intents:
[paste docs]

Now build a payment form that creates an intent when submitted."

**Step 3 - AI builds correctly:**
Uses correct Stripe API, proper error handling, right response format.

## Bottom line

Proper context setup takes 10 minutes once but saves hours on every request. Your agent builds things right the first time instead of you fixing generic garbage later.

Paste relevant docs for one-off tasks. Create project docs for patterns you use repeatedly. Use MCP tools for automatic access to framework docs. Always give AI the context it needs to build things YOUR way.`
    },
    {
      id: 'errors-console-logs',
      title: 'Error Messages & Console Logs',
      description: 'Where to find errors, what they mean, and how to get AI to fix them',
      icon: <Code className="h-6 w-6" weight="duotone" />,
      category: 'Troubleshooting',
      content: `Red text shows up and you panic. Don't. Most errors are stupid simple once you know where to look.

## Where to actually find errors

**Browser Console (for web apps):**
Right-click anywhere on your page → "Inspect" → "Console" tab. That's where JavaScript errors live.

**Terminal (where you ran the dev server):**
Look at the window where you typed \`npm run dev\` or whatever. Backend errors show up there.

**Network Tab:**
In the browser inspector, "Network" tab shows failed API calls. If something isn't loading, check here.

## Reading error messages without freaking out

Most error messages follow this pattern:
\`\`\`
ERROR: Something broke at line 42 in App.jsx
\`\`\`

You need 3 things:
1. What broke (usually at the top)
2. Which file (look for .js, .jsx, .ts, .tsx)
3. Line number (if you're lucky)

**Real example:**
\`\`\`
TypeError: Cannot read property 'map' of undefined
    at UserList.jsx:15
\`\`\`

Translation: Line 15 of UserList.jsx is trying to use .map() on something that doesn't exist yet. Usually means data hasn't loaded yet.

## The copy-paste-fix workflow

See an error? Do this:

1. Copy the ENTIRE error message (yes, even the scary stack trace)
2. Paste it to Claude Code
3. Tell it what you were trying to do when it broke
4. Let it fix it

**Example prompt:**
"Getting this error when I click the submit button: [paste error]. Fix it."

That's it. Seriously.

## Console logs - your debugging best friend

When AI generates code that "doesn't work" but has no errors, you need logging.

**Tell AI to add logs:**
"Add console.log statements to show what's happening at each step"

**What to log:**
- Function inputs: \`console.log('Function called with:', data)\`
- Variable values: \`console.log('User data:', userData)\`
- Conditionals: \`console.log('Checking if user is logged in:', isLoggedIn)\`

**Example request to AI:**
"Add logging to the login function so I can see what's happening. Log the email, the API response, and whether the login succeeded."

## When to add logging

Before asking AI to debug. "It doesn't work" with no info means AI is guessing. Logs = actual data to work with.

When something works locally but not in production. Logs show what's different.

Anytime you're confused about what the code is actually doing.

## Common errors and what they actually mean

**"Cannot read property X of undefined"**
→ You're trying to use data that hasn't loaded yet. Add a loading check.

**"404 Not Found"**
→ Your API call is hitting the wrong URL. Check the endpoint.

**"CORS error"**
→ Your frontend and backend aren't configured to talk. Tell AI "fix CORS issues."

**"Unexpected token"**
→ Syntax error, usually a missing bracket or comma. AI will spot it immediately.

**"Module not found"**
→ Missing package. Run \`npm install [package-name]\`.

## Pro tips for vibe coders

Don't try to understand every line of the stack trace. Just grab the first line and the file name.

If error messages are overwhelming, tell AI: "Explain this error like I'm 5."

Keep the browser console open while developing. Errors show up immediately instead of "why isn't this working??"

Logs are temporary. Once it works, tell AI to remove the console.logs.

## Bottom line

Errors aren't scary. They're AI telling you exactly what's wrong. Copy the error, paste to Claude, let it fix. Add logging when you need to see what's actually happening. That's it.`
    },
    {
      id: 'ai-stuck-loops',
      title: 'When AI Gets Stuck in Loops',
      description: 'Recognizing when your AI is confused and how to get it back on track',
      icon: <Code className="h-6 w-6" weight="duotone" />,
      category: 'Troubleshooting',
      content: `AI is powerful but it's not magic. Sometimes it gets confused, regenerates the same broken code, or just... stops making sense.

## How to tell AI is stuck

**The regeneration loop:**
You ask it to fix something, it makes changes, doesn't work, you ask again, it makes the SAME changes. That's a loop.

**The overcomplicate spiral:**
Simple request → AI generates complex solution → doesn't work → you ask for fixes → it adds MORE complexity → makes it worse.

**The "I forgot what we're doing" moment:**
AI starts suggesting things that contradict what you built 5 minutes ago. It lost context.

**The hallucination phase:**
AI confidently suggests using files, functions, or libraries that don't exist in your project.

## Why this happens

**Context overflow:**
Long conversations fill up AI's memory. It literally forgets earlier parts of the chat.

**Unclear problems:**
"It doesn't work" gives AI nothing to work with. It's guessing.

**Conflicting instructions:**
You told it one thing earlier, different thing now. It's confused.

**Actual limitations:**
Sometimes the approach just won't work and AI doesn't know another way.

## How to unstick AI

**The reset:**
Start a new chat. Copy ONLY the relevant code. Ask fresh.

**Example:**
Instead of continuing a 50-message thread, new chat: "This login function isn't working. Here's the code: [paste]. Error: [paste]. Fix it."

**The simplify prompt:**
"Stop. This is too complicated. Give me the simplest possible solution, even if it's not perfect."

**Example:**
"Forget all the auth middleware stuff. Just make a simple login that checks username and password. We'll add security later."

**The "explain it back" trick:**
"Explain what you think I'm trying to build."

If AI's explanation is wrong, your instructions weren't clear. Clarify before continuing.

**The constraint method:**
"Do this WITHOUT using [whatever it's obsessing over]."

**Example:**
AI keeps trying to use Redux when you don't have it: "Build this using only React useState. No Redux, no external state management."

## Breaking the regeneration loop

**Don't ask "fix it" again.**

Instead:
1. New chat OR
2. "Try a completely different approach" OR
3. "Show me 3 different ways to solve this"

**Example:**
Loop: AI keeps tweaking the same API call format
Break: "Forget axios. Show me how to do this with fetch() instead."

## When to just start over

You've been troubleshooting the same issue for 30+ minutes. Cut your losses.

AI has made the code more complex than when you started.

You don't understand what half the code does anymore.

**How to start over right:**
1. Save what works (commit it)
2. Delete everything that doesn't
3. New chat with clear, simple request
4. Mention what DIDN'T work last time

**Example:**
"I'm starting over. Need a user registration form. Last attempt failed because the API wasn't set up right. Let's build the form first, test it locally with fake data, THEN connect to API."

## Preventing loops before they happen

**Be specific about what "works" means:**
Instead of: "Build a search feature"
Better: "Build a search feature that filters this list of users by name as I type"

**Set boundaries:**
"Keep it simple. Don't use any libraries I haven't explicitly mentioned."

**Ask for steps:**
"Break this into steps and wait for my approval before implementing."

## The frustrated? Do this.

Stop coding for 10 minutes. Serious.

Come back and ask yourself: "What's the absolute simplest version of this that would work?"

Then tell AI to build THAT. Nothing more.

**Example:**
Original (too ambitious): "Build a real-time chat app with user presence, typing indicators, and message reactions"

Simplified: "Build a chat where messages appear when I submit them. That's it."

Get simple working first. Add features one at a time.

## Bottom line

AI loops are normal. Don't keep asking it to fix the same thing. Start fresh, simplify your request, or try a different approach. Sometimes the best solution is to build the dumbest version that works and iterate from there.`
    },
    {
      id: 'security-basics',
      title: 'Security Basics (Don\'t Get Hacked)',
      description: 'Simple security practices so your AI-built app doesn\'t become a disaster',
      icon: <ShieldCheck className="h-6 w-6" weight="duotone" />,
      category: 'Quality',
      content: `AI won't automatically make your app secure. It'll build what you ask for, security holes included.

## The stuff that actually matters

Most security disasters come from the same dumb mistakes. Avoid these and you're ahead of 90% of people.

## Never put secrets in your code

**Bad (AI does this by default):**
\`\`\`javascript
const API_KEY = "sk_live_12345..."
\`\`\`

Anyone who sees your code gets your API key. That includes everyone if you push to GitHub.

**Tell AI instead:**
"Use environment variables for all API keys and secrets. Show me how to set up a .env file."

**What happens:**
\`\`\`javascript
const API_KEY = process.env.API_KEY
\`\`\`

Now your secrets live in a .env file that NEVER gets committed to git.

## Validate every input users can touch

Users will try to break your app. Not even on purpose, they just do weird stuff.

**Example:**
User types \`<script>alert('hacked')</script>\` in your search box. Without validation, that code runs.

**Tell AI:**
"Add input validation and sanitization to all user inputs. Prevent XSS attacks."

**What to validate:**
- Email actually looks like an email
- Numbers are actually numbers
- Text fields have max length
- File uploads check file type
- Search inputs don't contain scripts

## Don't trust the frontend

Here's the thing: users can literally edit your JavaScript in their browser. Anything your frontend says can be faked.

**What this means:**
Never check permissions in frontend only. Always verify on the backend.

**Tell AI:**
"Add backend verification for user permissions. Don't rely on frontend checks."

**Example:**
Bad: Frontend hides the delete button for non-admins (users can still call the delete API)
Good: Backend checks if user is admin BEFORE deleting

## Password rules

**Tell AI this:**
"Set up password hashing with bcrypt. Minimum 8 characters. Never store passwords in plain text."

AI knows how to do this, but only if you ask. Otherwise it might just... store passwords directly (yikes).

## HTTPS, not HTTP

If you're collecting any user data (especially passwords), you need HTTPS.

**For local development:**
HTTP is fine.

**For production:**
HTTPS required. No excuses.

Vercel, Netlify, Railway - they all give you HTTPS automatically. Just use them.

## API security basics

**Add rate limiting:**
"Add rate limiting to prevent API abuse. Max 100 requests per minute per user."

Stops people from spamming your API and running up your bills.

**Use authentication:**
"Add JWT authentication to all API endpoints except login and signup."

Makes sure only logged-in users can access user data.

**Example prompt:**
"Protect all /api/ routes with JWT authentication. Users need to be logged in to access them."

## Database security

**Never expose your database directly:**
Your database should only talk to your backend. Never let frontend connect directly.

**Tell AI:**
"Set up API routes that handle database operations. Don't expose database connection to frontend."

**Use parameterized queries:**
AI usually does this by default, but worth checking.

**Example:**
Bad: \`SELECT * FROM users WHERE id = \${userId}\` (SQL injection risk)
Good: Using prepared statements that sanitize inputs

## The quick security checklist

Before launching anything:

✅ All secrets in .env file, not in code
✅ .env file in .gitignore
✅ User inputs validated and sanitized
✅ Passwords hashed, never plain text
✅ HTTPS in production
✅ API rate limiting enabled
✅ Authentication on protected routes
✅ Permissions checked on backend

## Prompting AI for security

**Don't just ask for features:**
"Build a login system"

**Ask for secure features:**
"Build a secure login system with password hashing, JWT tokens, and input validation"

**When reviewing AI code:**
"Review this code for security vulnerabilities. Check for XSS, SQL injection, and exposed secrets."

**After AI builds something:**
"Add security best practices to this code. Focus on input validation and authentication."

## Common security mistakes AI makes

**Trusts user input blindly:**
Tell it to validate and sanitize everything.

**Stores sensitive data in localStorage:**
Should be in httpOnly cookies or secure storage.

**Doesn't use HTTPS:**
You need to configure deployment for this.

**Weak password requirements:**
Specify minimum length and complexity.

**No rate limiting:**
Ask for it explicitly.

## What you DON'T need to worry about (yet)

Advanced encryption schemes. Just use HTTPS.

Penetration testing. That's for later when you have users.

Complex authentication systems. JWT is fine to start.

Security audits. Build first, audit if it takes off.

## Bottom line

Security isn't complicated if you do the basics. Use environment variables for secrets. Hash passwords. Validate inputs. Use HTTPS. Tell AI to include security from the start - it knows how, but only if you ask. Better to build it secure from the beginning than fix it after someone hacks you.`
    },
    {
      id: 'deploying-your-app',
      title: 'Deploying Your App (Getting It Online)',
      description: 'How to take your localhost app and put it on the internet for real people to use',
      icon: <Globe className="h-6 w-6" weight="duotone" />,
      category: 'Tools',
      content: `Your app works on your computer. Now what? Time to put it online so other people can actually use it.

## Localhost vs Production

**Localhost (your computer):**
- Only you can access it
- Uses http://localhost:3000 or similar
- Environment variables in .env file
- Can restart anytime, no one cares

**Production (deployed online):**
- Anyone can access it via a URL
- Uses HTTPS (secure)
- Environment variables set on the platform
- Needs to stay running 24/7

## Which Platform to Use

**Vercel - Best for frontend apps:**
- Perfect for: Next.js, React, Vue, any static site
- Free tier: Plenty for small projects
- Deploy time: 30 seconds
- CLI command: \`vercel\`

When to use: You built a frontend app. No complex backend, maybe some API routes.

**Railway - Best for backend/fullstack:**
- Perfect for: Node.js servers, Python apps, databases
- Free tier: $5 credit monthly
- Deploy time: 2-5 minutes
- CLI command: \`railway up\`

When to use: You have a backend server that needs to stay running. Need a database.

**Render - Best for databases + services:**
- Perfect for: Fullstack apps, background workers, Postgres database
- Free tier: Limited but works
- Deploy time: 5-10 minutes
- Easy dashboard setup

When to use: You need database + backend + maybe background jobs all in one place.

**Netlify - Alternative to Vercel:**
- Perfect for: Static sites, Jamstack, serverless functions
- Free tier: Generous
- Deploy time: 30 seconds
- Simple Git integration

When to use: Pure frontend, or Vercel is down/you want alternative.

## Deploying to Vercel (Frontend)

**Step 1 - Install CLI:**
\`\`\`bash
npm install -g vercel
\`\`\`

**Step 2 - Login:**
\`\`\`bash
vercel login
\`\`\`
Opens browser, click authorize.

**Step 3 - Deploy:**
\`\`\`bash
vercel
\`\`\`
Answer the questions (just hit enter for defaults).

**Step 4 - Production deploy:**
\`\`\`bash
vercel --prod
\`\`\`

Done. You get a URL like: \`your-app.vercel.app\`

**Environment variables on Vercel:**
1. Go to vercel.com dashboard
2. Select your project
3. Settings → Environment Variables
4. Add your variables (API_KEY, DATABASE_URL, etc)
5. Redeploy: \`vercel --prod\`

**Prompt for AI:**
"Make this app ready for Vercel deployment. Set up environment variables properly and show me what to add in Vercel dashboard."

## Deploying to Railway (Backend/Fullstack)

**Step 1 - Install CLI:**
\`\`\`bash
npm install -g @railway/cli
\`\`\`

**Step 2 - Login:**
\`\`\`bash
railway login
\`\`\`

**Step 3 - Initialize:**
\`\`\`bash
railway init
\`\`\`
Creates a new project.

**Step 4 - Deploy:**
\`\`\`bash
railway up
\`\`\`

**Adding environment variables:**
\`\`\`bash
railway variables set API_KEY=your_key_here
railway variables set DATABASE_URL=your_db_url
\`\`\`

Or set them in Railway dashboard → Variables tab.

**Prompt for AI:**
"Prepare this for Railway deployment. Show me which environment variables I need to set and how to configure the start command."

## Deploying to Render

**Dashboard approach (easiest):**

1. Push code to GitHub
2. Go to render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Build command: \`npm install\` or \`npm run build\`
   - Start command: \`npm start\`
6. Add environment variables
7. Click "Create Web Service"

**For databases:**
1. "New +" → "PostgreSQL"
2. Copy the connection URL
3. Add it as environment variable to your web service

**Prompt for AI:**
"Set up this app for Render. Show me the build command, start command, and environment variables I need."

## Common "Works Locally, Breaks Online" Issues

**1. Environment variables missing**
**Error:** "API_KEY is not defined"
**Fix:** Add all .env variables to your deployment platform

**Prompt:**
"Check this code for environment variables. List all variables I need to set in production."

**2. Wrong port**
**Error:** App doesn't start or shows "Cannot connect"
**Fix:** Use the PORT environment variable from the platform

**Code should look like:**
\`\`\`javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT);
\`\`\`

**Prompt:**
"Update this to use the PORT environment variable for deployment."

**3. Build command fails**
**Error:** "Build failed" or "Command not found"
**Fix:** Check package.json has correct scripts

**Prompt:**
"Add proper build and start scripts to package.json for deployment."

**4. Database connection fails**
**Error:** "ECONNREFUSED" or "Could not connect to database"
**Fix:** Use production database URL, not localhost

**Prompt:**
"Update database connection to work in production. Use environment variable for the database URL."

**5. API calls use localhost**
**Error:** API calls fail in production
**Fix:** Use relative URLs or environment variable for API base URL

**Bad:**
\`\`\`javascript
fetch('http://localhost:3000/api/users')
\`\`\`

**Good:**
\`\`\`javascript
fetch('/api/users')  // Relative URL
// OR
fetch(\`\${process.env.API_URL}/users\`)
\`\`\`

**6. CORS errors**
**Error:** "CORS policy blocked"
**Fix:** Configure CORS to allow your frontend domain

**Prompt:**
"Add CORS configuration for production. Allow requests from [your-frontend-url]."

**7. Case-sensitive file paths**
**Error:** "Module not found"
**Fix:** Linux (production) is case-sensitive, Mac/Windows aren't

\`\`\`javascript
// Locally works, production breaks:
import User from './Components/User'  // Components is capitalized

// Should be:
import User from './components/User'  // Match actual folder name
\`\`\`

## Environment Variables Checklist

Before deploying, make sure you have:

✅ API keys (Stripe, OpenAI, etc)
✅ Database URL
✅ JWT secret or session secret
✅ Third-party service URLs
✅ PORT (Railway/Render handle this automatically)

**Don't include in .env variables:**
- Public URLs (hardcode these)
- App name (not sensitive)
- Version numbers

## Quick Deploy Checklist

Before hitting deploy:

1. ✅ All environment variables listed
2. ✅ No localhost URLs in code
3. ✅ Using process.env.PORT for server port
4. ✅ Build command works: \`npm run build\`
5. ✅ Start command works: \`npm start\`
6. ✅ .gitignore includes .env file
7. ✅ Database connection uses environment variable

## Testing Before Deploy

**Run in production mode locally:**
\`\`\`bash
npm run build
npm start
\`\`\`

If this works, deployment will probably work.

**Test with production environment variables:**
\`\`\`bash
# Railway
railway run npm start

# Or manually set them:
PORT=3000 DATABASE_URL=xxx npm start
\`\`\`

## After Deployment

**Your app is live! Now what?**

**Get your URL:**
- Vercel: \`your-app.vercel.app\`
- Railway: Check dashboard or run \`railway domain\`
- Render: Shows in dashboard after deploy

**Check logs if something breaks:**
\`\`\`bash
# Vercel
vercel logs

# Railway
railway logs

# Render
Check dashboard → Logs tab
\`\`\`

**Redeploy after changes:**
Just push to Git (if connected) or run deploy command again.

## Prompting AI for Deployment

**Before deploying:**
"Review this code for deployment readiness. Check for localhost URLs, environment variables, and port configuration."

**For platform-specific help:**
"Set up this app for [Vercel/Railway/Render] deployment. Show me the exact commands and configuration needed."

**For fixing deployment errors:**
"Deployment failed with this error: [paste error]. Fix it for [platform] deployment."

**For environment setup:**
"List all environment variables this app needs. Explain what each one is for."

## Bottom Line

Deployment isn't scary. Pick the right platform (Vercel for frontend, Railway for backend). Install CLI, login, deploy. Set environment variables. Fix the "localhost works, production breaks" issues (usually environment variables or ports). Test locally in production mode first. Your app will be online in under 10 minutes.`
    },
    {
      id: 'understanding-project-files',
      title: 'Understanding Your Project Files',
      description: 'Following what AI builds so you actually know where things are in your project',
      icon: <Code className="h-6 w-6" weight="duotone" />,
      category: 'Fundamentals',
      content: `AI just created 15 files. You have no idea what any of them do or where to find anything. Let's fix that.

## Why This Matters

You can't modify what you can't find. When AI builds your app, you need to know:
- Where components live
- Which file has the function you need to change
- How files connect to each other
- Where to tell AI to make changes

## Watch AI As It Works

**DON'T do this:**
Tell AI to build something, walk away, come back to 20 new files, totally lost.

**DO this:**
Watch AI's output as it works. It tells you what it's doing:
\`\`\`
Creating src/components/UserList.tsx
Updating src/app/page.tsx
Creating src/lib/api.ts
\`\`\`

Write these down or screenshot them. You'll need to know later.

## Common Project Structures

**React/Next.js:**
\`\`\`
/src
  /app           # Pages (Next.js 13+)
  /components    # Reusable UI pieces
  /lib           # Helper functions
  /api           # API routes (Next.js)
/public          # Images, static files
.env             # Secret keys (not committed)
package.json     # Dependencies list
\`\`\`

**Backend (Node/Express):**
\`\`\`
/src
  /routes        # API endpoints
  /controllers   # Business logic
  /models        # Database schemas
  /middleware    # Auth, validation
.env             # Database URL, secrets
server.js        # Entry point
\`\`\`

**Python/FastAPI:**
\`\`\`
/app
  /routes        # API endpoints
  /models        # Database models
  /services      # Business logic
.env             # Environment variables
main.py          # Entry point
requirements.txt # Dependencies
\`\`\`

## What Each Type of File Does

**Components (React):**
Files in \`/components\` are reusable UI pieces. Button.tsx is a button. UserCard.tsx shows user info.

**Pages/Routes:**
Files that represent URLs. \`/app/dashboard/page.tsx\` = yoursite.com/dashboard

**API files:**
Handle backend logic. \`/api/users.ts\` = yoursite.com/api/users endpoint

**Lib/Utils:**
Helper functions used everywhere. \`lib/api.ts\` might have your fetch function.

**Config files:**
- \`.env\` - Secret keys and variables
- \`package.json\` - What packages you're using
- \`tsconfig.json\` - TypeScript settings
- \`tailwind.config.js\` - Styling setup

## Following AI's Work in VS Code

**Open the file explorer (left sidebar).**

When AI says "Creating src/components/UserList.tsx":
1. Look at left sidebar
2. Find src folder → components folder → UserList.tsx
3. Click it to see what AI created

**Watch for these indicators:**
- Green dot = New file
- Yellow dot = Modified file
- File name highlighted = Recently changed

**Tip:**
Keep the Explorer panel open while AI works. You'll see files appear in real-time.

## How to Know Where to Find Things

**Looking for a button?**
→ /components folder

**Looking for a page?**
→ /app or /pages folder (depending on framework)

**Looking for API logic?**
→ /api, /routes, or /controllers folder

**Looking for database stuff?**
→ /models or /lib/db files

**Looking for styling?**
→ Same folder as component, or /styles folder

## How Files Connect

**Example: User Profile Page**

\`app/profile/page.tsx\` (the page)
→ imports \`UserProfile\` from \`components/UserProfile.tsx\`
→ which uses \`fetchUser\` from \`lib/api.ts\`
→ which calls \`/api/users\` endpoint

**To trace a feature:**
1. Start at the page file
2. Look at the imports at the top
3. Follow each import to its file
4. See what that file imports

**Prompt for AI:**
"Explain how these files connect: [list files]. Show me the flow from user action to data display."

## Reading File Paths in AI Output

When AI says:
\`\`\`
Updating src/components/user/UserCard.tsx
\`\`\`

**Translation:**
- \`src\` = source folder (root of your code)
- \`components\` = components folder
- \`user\` = subfolder for user-related components
- \`UserCard.tsx\` = the actual file

**In VS Code:**
Navigate: src → components → user → UserCard.tsx

## When AI Creates Too Many Files

**Happens when:**
AI over-engineers and creates 20 files for a simple feature.

**What to do:**
"List all the files you just created and explain what each one does in one sentence."

AI will give you a map. Now you know what's what.

**Better approach:**
"Keep this simple. Create the minimum number of files needed."

## Tracking Changes During Development

**Before asking AI to make changes:**
\`\`\`bash
git status
\`\`\`

Shows which files you're about to change. Helps you track what AI modified.

**After AI makes changes:**
\`\`\`bash
git diff
\`\`\`

Shows exactly what changed in each file. Review AI's changes before committing.

## Finding Specific Code

**Don't scroll through files manually.**

**Use VS Code search (Cmd/Ctrl + Shift + F):**
- Search for function names
- Search for component names
- Search for text that appears in the UI

**Example:**
Looking for login logic? Search "login" across all files.

**Prompt for AI:**
"Where is the [function name] function located? Show me the file path."

## Project File Naming Patterns

**Good AI-generated structure:**
\`\`\`
components/
  Button.tsx          # Generic button
  UserButton.tsx      # User-specific button
  user/
    UserCard.tsx      # User card component
    UserList.tsx      # List of users
    UserProfile.tsx   # User profile page component
\`\`\`

**Messy structure:**
\`\`\`
components/
  comp1.tsx           # What is this?
  thing.tsx           # What does this do?
  temp.tsx            # Temporary what?
\`\`\`

**If AI creates messy names:**
"Rename these files to be more descriptive. Use clear names that explain what each file does."

## Asking AI for a Project Map

**When you're lost:**
"Create a file structure map for this project. Show me what each major folder contains and what the main files do."

AI will generate something like:
\`\`\`
/src
  /components
    - Button.tsx (reusable button)
    - UserCard.tsx (displays user info)
  /app
    - page.tsx (homepage)
    - layout.tsx (app layout)
  /lib
    - api.ts (API calls)
\`\`\`

Now you have a reference map.

## Red Flags You're Lost

**Signs you don't understand the structure:**
- Can't find where to make a simple change
- Don't know which file handles a feature
- Copying code to wrong location
- Scared to delete anything

**Solution:**
"Explain this project's structure. Where are components? Where are API calls? Where are pages? Give me a tour."

## Staying Organized As You Build

**Name things clearly from the start:**
"When creating files, use descriptive names. UserList not List. LoginForm not Form."

**Group related files:**
"Put all user-related components in a user folder."

**Ask for documentation:**
"Add comments at the top of each file explaining what it does."

## Bottom Line

Don't let AI build blindly while you look away. Watch what it creates. Know your folder structure. Use VS Code file search. Ask AI for a project map when lost. Name things clearly. Understand how files connect. You don't need to read every line, but you NEED to know where things are. Otherwise you're just hoping AI knows what you're talking about when you ask for changes.`
    },
    {
      id: 'when-to-start-over',
      title: 'When to Give Up and Start Over',
      description: 'Knowing when to stop fixing and just rebuild from scratch (saves hours)',
      icon: <Code className="h-6 w-6" weight="duotone" />,
      category: 'Troubleshooting',
      content: `You've been debugging for 3 hours. The code is a mess. You're not even sure what half of it does anymore. Time to nuke it and start fresh.

## Signs You Should Start Over

**You've spent 2+ hours on the same bug**
If fixing one thing breaks two other things, the foundation is broken.

**You don't understand what the code does**
Can't modify what you don't understand. If AI over-engineered it and you're lost, start fresh with simpler requirements.

**The code is more complex than the feature**
100 lines to display a list? Yeah, that's overcomplicated.

**Each fix creates new bugs**
Whack-a-mole debugging = bad foundation. Rebuild it right.

**AI keeps suggesting "workarounds"**
Workarounds = band-aids. If AI isn't fixing root cause, the code needs rewriting.

**You can't explain how it works**
"It just... does something... and then it works maybe?" Not good enough.

## When to Keep Fixing (Don't Give Up Too Early)

**It's a simple bug with a clear cause**
"Missing semicolon" = fix it. Don't rebuild.

**You understand the code**
If you know what's wrong and how to fix it, fix it.

**It's almost working**
If 90% works and you know the issue, finish it.

**The foundation is solid**
Code is clean, organized, just one feature buggy = fix that feature.

## The "Is It Worth Saving?" Test

Ask yourself:

1. **Can I explain how this code works?**
   - Yes = fixable
   - No = probably rebuild

2. **Is the bug in one place or everywhere?**
   - One place = fix it
   - Everywhere = rebuild

3. **Will fixing this break other things?**
   - No = fix it
   - Yes = bad foundation, rebuild

4. **Can I finish this in under 30 minutes?**
   - Yes = keep going
   - No = consider starting over

If 2+ answers point to rebuild, start over.

## How to Start Over the Right Way

**Step 1: Save what works**
Don't delete everything. Save the good parts.

\`\`\`bash
git commit -am "Saving working parts before rebuild"
git branch old-attempt
git checkout main
\`\`\`

Now you have a backup. Can cherry-pick good code later.

**Step 2: Extract working pieces**

**Prompt:**
"Look at this code. What parts actually work? Extract those functions/components so I can reuse them."

AI will pull out the salvageable pieces.

**Step 3: Delete the broken stuff**

Delete files that are causing problems. Don't be scared. You have a git backup.

**Step 4: Start fresh with lessons learned**

**Prompt:**
"I'm rebuilding [feature]. Last attempt failed because [reason]. This time, build it simpler: [clear requirements]. Don't [whatever went wrong last time]."

**Example:**
"I'm rebuilding user authentication. Last attempt was too complex with Redux, middleware, and weird state management. This time: simple localStorage for token, basic fetch calls, no fancy state management."

## Real Example: Starting Over

**Scenario:** Built a search feature. Doesn't work. Spent 2 hours debugging. Code is a mess.

**Bad approach:**
Keep tweaking the same broken code. Add workarounds. Make it worse.

**Good approach:**

**1. Save current state:**
\`\`\`bash
git commit -am "Search feature - not working yet"
\`\`\`

**2. Ask AI what went wrong:**
"This search feature doesn't work. Explain what's wrong with this approach."

**3. Start fresh:**
"Delete the search code. Start over. Build a simple search: filter an array of items by name as I type. Nothing fancy."

**4. AI builds simpler version in 5 minutes.**

**5. It works.**

You just saved yourself 2 more hours of debugging.

## Extracting the Good Parts

**Before nuking everything:**

**Prompt:**
"Review this code. Extract:
- Functions that work correctly
- Components that don't have bugs
- Utility functions I can reuse

Show me which files to keep and which to delete."

AI will help you save the good stuff before you rebuild.

## The Fresh Start Template

**Use this prompt:**
\`\`\`
I'm starting over on [feature].

What went wrong last time:
- [Problem 1]
- [Problem 2]

This time, build it:
- Simple (no fancy patterns)
- Minimal (only what I asked for)
- Clear (I need to understand it)

Requirements:
[List exact requirements]

Don't [things that went wrong last time].
\`\`\`

**Real example:**
\`\`\`
I'm starting over on the user dashboard.

What went wrong last time:
- Too many components
- Complex state management
- Couldn't figure out which file did what

This time, build it:
- Simple (just React hooks, no Redux)
- Minimal (one Dashboard component to start)
- Clear (add comments explaining what each part does)

Requirements:
- Show list of users
- Click user to see details
- Add/delete users

Don't create separate files for every tiny thing. Keep it in one place until it gets too big.
\`\`\`

## When You're Frustrated

**Stop. Seriously, stop.**

You're not thinking clearly when frustrated. Take 10 minutes away.

Come back and ask:
- "What's the simplest version of this that would work?"
- "If I had to rebuild this in 20 minutes, what would I do?"

That's what you should build.

## The "Good Enough" Principle

**Vibe coder truth:**
Messy but working > perfect but broken.

**Don't rebuild because:**
- Code isn't "clean"
- You saw a "better" way
- Someone said to use a different pattern

**Do rebuild because:**
- It doesn't work
- You can't modify it
- Debugging is taking longer than rebuilding

## Preventing "Need to Start Over" Situations

**Start simple, add complexity later:**
"Build the simplest version first. I'll ask for improvements once it works."

**Test as you go:**
"Build this step by step. After each step, show me how to test it."

**Limit scope:**
"Just build [core feature]. No extra features, no optimization, no fancy patterns."

**Ask for clarity:**
"Keep the code simple enough that I can understand and modify it later."

## The Nuclear Option: Complete Restart

**When nothing is salvageable:**

\`\`\`bash
# Backup everything
git branch nuclear-option-backup

# Create fresh branch
git checkout -b clean-start

# Delete src folder (or whatever your code is in)
rm -rf src

# Start completely fresh
\`\`\`

**Prompt:**
"Starting completely fresh. Build [your app] from scratch. Here's what I need: [requirements]. Keep it simple and build incrementally."

## After Starting Over

**Test immediately:**
Don't wait to test. Make sure the new approach works before building more.

**Keep it simple:**
Resist the urge to add complexity. Simple working code > fancy broken code.

**Save frequently:**
Commit after each working feature. If something breaks, you can rollback.

## Bottom Line

Know when to quit. 2+ hours debugging the same thing = probably time to start over. Save the working parts, delete the mess, start fresh with simpler approach. You'll finish faster than if you kept debugging. Don't be emotionally attached to broken code. Sometimes the fastest way forward is hitting reset. Build simple, test often, commit frequently. If you're lost in your own code, AI definitely is too. Start over with clear, simple requirements.`
    },
    {
      id: 'code-building-blocks',
      title: 'Code Building Blocks Explained',
      description: 'What functions, variables, imports, and other code pieces actually mean',
      icon: <Code className="h-6 w-6" weight="duotone" />,
      category: 'Fundamentals',
      content: `You're looking at AI-generated code and see "const", "function", "import"... but what ARE these things? Let's break it down.

## Why This Matters

Understanding code building blocks helps you:
- Read AI code without being lost
- Prompt AI more specifically ("add a function that..." vs "make it do...")
- Know where to tell AI to make changes
- Recognize patterns across different files

You don't need to write code yourself. But knowing what each piece does = better communication with AI.

## Variables (Storing Information)

**What they are:**
Boxes that hold information. Give them a name, put stuff in them, use them later.

**Three ways to create them:**

\`\`\`javascript
const name = "John"      // Can't change later
let age = 25             // Can change later
var old = "don't use"    // Old way, avoid it
\`\`\`

**When you see them:**
\`\`\`javascript
const users = [...]      // List of users
let isLoggedIn = true    // True/false value
const API_KEY = "xxx"    // Secret key
\`\`\`

**Use const by default.** Only use let if the value needs to change.

**Prompting AI:**
- "Create a const for the API URL"
- "Add a variable to track if the user is logged in"
- "Store the user data in a const called userData"

## Functions (Doing Things)

**What they are:**
Reusable chunks of code that do specific tasks. Like a recipe - write it once, use it many times.

**Basic structure:**
\`\`\`javascript
function doSomething() {
  // Code that does the thing
}
\`\`\`

**With inputs (parameters):**
\`\`\`javascript
function greetUser(name) {
  return "Hello, " + name
}

greetUser("John")  // Returns "Hello, John"
\`\`\`

**Modern style (arrow functions):**
\`\`\`javascript
const greetUser = (name) => {
  return "Hello, " + name
}

// Shorter version:
const greetUser = (name) => "Hello, " + name
\`\`\`

**When you see them:**
\`\`\`javascript
function fetchUsers() { }        // Gets users from API
const handleClick = () => { }    // Runs when button clicked
async function login() { }       // Async = waits for things
\`\`\`

**Prompting AI:**
- "Create a function called getUserData that fetches user info"
- "Add a function to handle the form submission"
- "Break this into smaller functions"

## Imports (Bringing In Code)

**What they are:**
Bringing code from other files or packages into current file. Like grabbing tools from a toolbox.

**From other files:**
\`\`\`javascript
import Button from './components/Button'
import { UserCard } from './components/UserCard'
import * as utils from './lib/utils'
\`\`\`

**From installed packages:**
\`\`\`javascript
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
\`\`\`

**What the syntax means:**
\`\`\`javascript
import Thing from 'place'        // Default export
import { Thing } from 'place'    // Named export
import { Thing as T } from 'p'   // Rename it
import * as All from 'place'     // Everything
\`\`\`

**Prompting AI:**
- "Import the UserCard component from components folder"
- "Add axios import for API calls"
- "Import useState and useEffect from React"

## Exports (Sharing Code)

**What they are:**
Making code available for other files to import. Opposite of imports.

**Default export (one main thing per file):**
\`\`\`javascript
export default function Button() { }

// Or
function Button() { }
export default Button
\`\`\`

**Named exports (multiple things per file):**
\`\`\`javascript
export const fetchUsers = () => { }
export const deleteUser = () => { }
export const config = { }
\`\`\`

**When to use which:**
- Default: Main component or function in a file
- Named: Multiple utilities or helpers

**Prompting AI:**
- "Export this function so other files can use it"
- "Make this a default export"
- "Export both functions from this file"

## Objects (Grouping Related Data)

**What they are:**
Containers holding related information with named properties.

\`\`\`javascript
const user = {
  name: "John",
  age: 25,
  email: "john@example.com"
}

// Accessing properties:
user.name        // "John"
user["email"]    // "john@example.com"
\`\`\`

**Nested objects:**
\`\`\`javascript
const user = {
  name: "John",
  address: {
    city: "NYC",
    zip: "10001"
  }
}

user.address.city  // "NYC"
\`\`\`

**When you see them:**
- User data
- Configuration settings
- API responses
- Component props

**Prompting AI:**
- "Create an object for user profile data"
- "Add a config object with API settings"
- "Access the email property from the user object"

## Arrays (Lists of Things)

**What they are:**
Ordered lists of items. Like a shopping list.

\`\`\`javascript
const numbers = [1, 2, 3, 4]
const users = ["John", "Jane", "Bob"]
const mixed = [1, "text", true, { name: "John" }]
\`\`\`

**Common operations:**
\`\`\`javascript
users.length           // How many items: 3
users[0]               // First item: "John"
users.push("Alice")    // Add to end
users.map(u => ...)    // Transform each item
users.filter(u => ...) // Keep some items
\`\`\`

**When you see them:**
\`\`\`javascript
const users = [...]          // List of users
const items = [...]          // List of items
const [a, b] = [1, 2]       // Destructuring (explained below)
\`\`\`

**Prompting AI:**
- "Create an array of user objects"
- "Filter the array to show only active users"
- "Map over the users array and display names"

## Destructuring (Unpacking Data)

**What it is:**
Quick way to pull values out of objects or arrays.

**Object destructuring:**
\`\`\`javascript
// Instead of:
const name = user.name
const email = user.email

// Do this:
const { name, email } = user
\`\`\`

**Array destructuring:**
\`\`\`javascript
// Instead of:
const first = items[0]
const second = items[1]

// Do this:
const [first, second] = items
\`\`\`

**In function parameters:**
\`\`\`javascript
// Instead of:
function greet(user) {
  return "Hello, " + user.name
}

// Do this:
function greet({ name }) {
  return "Hello, " + name
}
\`\`\`

**When you see it:**
Common in React components and modern JavaScript.

## Conditional Logic (If This, Then That)

**What it is:**
Making decisions in code. Do different things based on conditions.

**If statements:**
\`\`\`javascript
if (isLoggedIn) {
  showDashboard()
} else {
  showLogin()
}
\`\`\`

**Ternary (short version):**
\`\`\`javascript
const message = isLoggedIn ? "Welcome" : "Please login"
\`\`\`

**Multiple conditions:**
\`\`\`javascript
if (age < 18) {
  return "Too young"
} else if (age > 65) {
  return "Senior"
} else {
  return "Adult"
}
\`\`\`

**Switch statements:**
\`\`\`javascript
switch (role) {
  case "admin":
    return "Full access"
  case "user":
    return "Limited access"
  default:
    return "No access"
}
\`\`\`

**Prompting AI:**
- "Add an if statement to check if user is logged in"
- "Use a ternary to show different messages"
- "Add conditional logic based on user role"

## Loops (Repeating Actions)

**What they are:**
Running the same code multiple times, usually over a list.

**For loop:**
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i)  // Prints 0, 1, 2, 3, 4
}
\`\`\`

**For...of loop (cleaner):**
\`\`\`javascript
for (const user of users) {
  console.log(user.name)
}
\`\`\`

**Array methods (modern way):**
\`\`\`javascript
users.forEach(user => {
  console.log(user.name)
})

users.map(user => user.name)  // Transform
users.filter(user => user.age > 18)  // Filter
\`\`\`

**When you see them:**
Processing lists, displaying multiple items, repeating tasks.

**Prompting AI:**
- "Loop through the users array and display each name"
- "Use map to transform the data"
- "Filter the list to show only active items"

## Async/Await (Waiting for Things)

**What it is:**
Handling operations that take time (API calls, file reads, etc).

**The old way (promises):**
\`\`\`javascript
fetchData().then(data => {
  console.log(data)
})
\`\`\`

**The modern way (async/await):**
\`\`\`javascript
async function getData() {
  const data = await fetchData()
  console.log(data)
}
\`\`\`

**With error handling:**
\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData()
    console.log(data)
  } catch (error) {
    console.error("Failed:", error)
  }
}
\`\`\`

**When you see it:**
- API calls
- Database queries
- File operations
- Anything that takes time

**Prompting AI:**
- "Make this function async and await the API call"
- "Add error handling to this async function"
- "Use async/await instead of .then()"

## Template Literals (String Building)

**What they are:**
Easy way to build strings with variables inside.

**Old way:**
\`\`\`javascript
const message = "Hello, " + name + "! You have " + count + " messages."
\`\`\`

**New way (template literals):**
\`\`\`javascript
const message = \`Hello, \${name}! You have \${count} messages.\`
\`\`\`

**Multiline:**
\`\`\`javascript
const html = \`
  <div>
    <h1>\${title}</h1>
    <p>\${content}</p>
  </div>
\`
\`\`\`

**Prompting AI:**
- "Use template literals for the string"
- "Build the URL using template literals with the userId"

## Comments (Notes in Code)

**What they are:**
Text that doesn't run. Used to explain what code does.

**Single line:**
\`\`\`javascript
// This is a comment
const user = getData()  // Get user data
\`\`\`

**Multiple lines:**
\`\`\`javascript
/*
  This function fetches user data
  from the API and returns it
*/
function fetchUser() { }
\`\`\`

**When to use:**
- Explain WHY something exists (not WHAT it does - that should be obvious)
- Mark TODOs
- Temporarily disable code

**Prompting AI:**
- "Add comments explaining what this function does"
- "Add a comment above this complex logic"

## Common Patterns You'll See

**API Call Pattern:**
\`\`\`javascript
async function fetchUsers() {
  const response = await fetch('/api/users')
  const data = await response.json()
  return data
}
\`\`\`

**React Component Pattern:**
\`\`\`javascript
function Button({ text, onClick }) {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}
\`\`\`

**Error Handling Pattern:**
\`\`\`javascript
try {
  const data = await riskyOperation()
  return data
} catch (error) {
  console.error(error)
  return null
}
\`\`\`

## Reading Code Top to Bottom

**Typical file structure:**

\`\`\`javascript
// 1. Imports (bringing in tools)
import React from 'react'
import Button from './Button'

// 2. Constants/Config (settings)
const API_URL = "https://api.example.com"

// 3. Main component/function
function UserList() {
  // Variables (data storage)
  const [users, setUsers] = useState([])

  // Helper functions (doing specific tasks)
  const fetchUsers = async () => { }

  // Return/Render (what displays)
  return <div>...</div>
}

// 4. Export (share with other files)
export default UserList
\`\`\`

## Prompting AI With This Knowledge

**Now you can be specific:**

❌ "Make it work"
✅ "Add an async function called fetchUsers that calls the API"

❌ "Add that thing"
✅ "Create a const called userData to store the API response"

❌ "Import the stuff"
✅ "Import useState and useEffect from React"

❌ "Loop through it"
✅ "Use map to loop through the users array and display each name"

## When You See Something New

**Don't panic. Ask AI:**
- "What does this syntax mean? [paste code]"
- "Explain what this function does in simple terms"
- "What is [keyword/pattern] used for?"

**Example:**
You see: \`const { data } = await response.json()\`

Ask: "Explain this line. What is the destructuring doing?"

AI: "It's calling response.json() (which returns a Promise), waiting for it with await, then destructuring the 'data' property from the result."

## Bottom Line

You don't need to memorize all this. But knowing what const, function, import, and async mean helps you:
1. Understand AI's output
2. Prompt AI more specifically
3. Know where to ask for changes
4. Read code without being lost

When you see unfamiliar syntax, ask AI to explain it. The more you understand these building blocks, the better you can direct AI to build what you actually want.`
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
            <div className="flex items-start justify-between">
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
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learn
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <Card className="px-6 py-4">
              <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-heading-1">Learn with Ken</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                Essential coding knowledge, best practices, and pro tips
              </p>
            </div>
            <div className="relative mt-1">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTiles.map((tile, index) => (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="relative p-4 h-full cursor-pointer transition-all duration-200 group overflow-hidden hover:border-primary hover:shadow-lg"
                  onClick={() => setSelectedTile(tile.id)}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />

                  <div className="relative flex flex-col h-full">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {tile.icon}
                      </div>
                    </div>

                    <h3 className="text-heading-4 mb-1">{tile.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {tile.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
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