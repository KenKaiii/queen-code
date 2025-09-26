import { useRef, useCallback, useEffect, useState } from 'react';

interface UseScrollToBottomOptions {
  threshold?: number;
  dependencies?: React.DependencyList;
}

interface UseScrollToBottomReturn {
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  showScrollToBottom: boolean;
  scrollToBottom: () => void;
}

/**
 * Custom hook for managing auto-scroll to bottom behavior in chat interfaces
 * Based on proven patterns from ByteDance UI-TARS and other production chat apps
 */
export const useScrollToBottom = ({
  threshold = 100,
  dependencies = [],
}: UseScrollToBottomOptions = {}): UseScrollToBottomReturn => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const userHasScrolledUpRef = useRef(false);
  const lastScrollHeightRef = useRef(0);

  // Handle scroll events to determine if user scrolled up
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;

    setShowScrollToBottom(!isNearBottom);

    // If scroll height changed (new content) but user didn't cause it, don't mark as user scroll
    if (scrollHeight !== lastScrollHeightRef.current) {
      lastScrollHeightRef.current = scrollHeight;
      return;
    }

    // User manually scrolled up
    if (!isNearBottom) {
      userHasScrolledUpRef.current = true;
    } else {
      // User scrolled back to bottom
      userHasScrolledUpRef.current = false;
    }
  }, [threshold]);

  // Smooth scroll to bottom function
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
    userHasScrolledUpRef.current = false;
  }, []);

  // Auto-scroll when dependencies change (new messages)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Always scroll to bottom unless user has explicitly scrolled up
    if (!userHasScrolledUpRef.current) {
      // Use requestAnimationFrame for better timing with DOM updates
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
          lastScrollHeightRef.current = container.scrollHeight;
        }
      });
    }
  }, dependencies);

  // Attach scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    messagesContainerRef,
    messagesEndRef,
    showScrollToBottom,
    scrollToBottom,
  };
};