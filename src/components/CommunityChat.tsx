import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PaperPlaneTilt, Users } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase, getStoredUsername, type ChatMessage } from "@/lib/supabase";
import notificationSound from "@/assets/notificationchat.mp3";

interface CommunityChatProps {
  className?: string;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username] = useState(() => getStoredUsername());
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const channelRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.volume = 0.5;

    // Prime the audio on first user interaction to avoid autoplay block
    const primeAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
        }).catch(() => {
          // Ignore - will retry on actual notification
        });
      }
      // Remove listener after first interaction
      document.removeEventListener('click', primeAudio);
      document.removeEventListener('keydown', primeAudio);
    };

    document.addEventListener('click', primeAudio, { once: true });
    document.addEventListener('keydown', primeAudio, { once: true });
  }, []);

  useEffect(() => {
    loadRecentMessages();
    const cleanup = subscribeToMessages();
    return cleanup;
  }, []);

  const loadRecentMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Failed to load messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('community-chat', {
        config: {
          presence: {
            key: username,
          },
        },
      })
      .on('broadcast', { event: 'new-message' }, (payload) => {
        console.log('New message received via broadcast:', payload);
        const message = payload.payload as ChatMessage;

        // Only add if not already in messages (avoid duplicates from optimistic update)
        setMessages((prev) => {
          if (prev.find(m => m.id === message.id)) return prev;

          // Play notification sound if message is from another user
          if (message.username !== username && audioRef.current) {
            audioRef.current.play().catch(err => console.error('Failed to play notification:', err));
          }

          return [...prev, message];
        });
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        console.log('Online users updated:', count);
        setOnlineUsers(count);
      })
      .subscribe(async (status) => {
        console.log('Channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: username,
            online_at: new Date().toISOString()
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setIsLoading(true);
    setInputValue("");

    try {
      // Insert into database first to get the real ID
      const { data, error } = await supabase
        .from('messages')
        .insert({
          username,
          message: messageText,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local UI immediately (since broadcast doesn't echo to sender)
      setMessages((prev) => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });

      // Broadcast to all OTHER connected users
      if (channelRef.current) {
        const broadcastResult = await channelRef.current.send({
          type: 'broadcast',
          event: 'new-message',
          payload: data,
        });
        console.log('Broadcast sent:', broadcastResult);
      } else {
        console.warn('Channel not ready for broadcast');
      }

      textareaRef.current?.focus();
    } catch (err) {
      console.error('Failed to send message:', err);
      setInputValue(messageText); // Restore input on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("h-full overflow-y-auto", className)}>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1">Community Chat</h1>
              <p className="mt-1 text-body-small text-muted-foreground">
                Chat with other Queen Code users
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Chatting as {username}
              </Badge>
              <Badge variant="outline" className="gap-2">
                <Users className="h-4 w-4" weight="duotone" />
                {onlineUsers} online
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 pt-0 pb-24 space-y-3 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex flex-col gap-1",
                  msg.username === username ? "items-end" : "items-start"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {msg.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg max-w-md break-words",
                    msg.username === username
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.message.split(/(\bhttps?:\/\/\S+)/g).map((part, i) => {
                      if (part.match(/^https?:\/\//)) {
                        return (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:opacity-80 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {part}
                          </a>
                        );
                      }
                      return part;
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Position Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
          <div className="container mx-auto">
            <div className="p-3">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Send a message..."
                  className="resize-none pr-12 pl-3 py-2.5 min-h-[56px] max-h-[200px]"
                  disabled={isLoading}
                />
                <div className="absolute right-1.5 bottom-1.5">
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    variant={inputValue.trim() ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 transition-all",
                      inputValue.trim() && !isLoading && "shadow-sm"
                    )}
                  >
                    <PaperPlaneTilt className="h-4 w-4" weight="duotone" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};