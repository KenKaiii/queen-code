import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cvbbqwqircrbebzasovq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YmJxd3FpcmNyYmViemFzb3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDMxMTMsImV4cCI6MjA3NDQ3OTExM30.8sBiKX_rzFZGjcGV62Pkw9xSmV0VtyhObLONKgxT3VM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

export const generateUsername = (): string => {
  const adjectives = [
    'Caffeinated', 'Debugging', 'Sleepless', 'Googling', 'Procrastinating',
    'StackOverflow', 'Refactoring', 'Compiling', 'Panicking', 'Typing',
    'Overthinking', 'Yolo', 'Rubber', 'Async', 'Deprecated',
    'Legacy', 'Spaghetti', 'Screaming', 'Confused', 'Enlightened'
  ];
  const nouns = [
    'Potato', 'Llama', 'Unicorn', 'Wizard', 'Ninja', 'Duck',
    'Hamster', 'Raccoon', 'Burrito', 'Muffin', 'Waffle', 'Narwhal',
    'Penguin', 'Sloth', 'Donut', 'Pickle', 'Banana', 'Taco'
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  return `${adj}${noun}${num}`;
};

export const getStoredUsername = (): string => {
  let username = localStorage.getItem('queen-code-chat-username');
  if (!username) {
    username = generateUsername();
    localStorage.setItem('queen-code-chat-username', username);
  }
  return username;
};