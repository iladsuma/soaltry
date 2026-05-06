"use client";

import { useEffect, useState } from "react";
import { Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubTestTimerProps {
  initialSeconds: number;
  onExpire: () => void;
  isActive: boolean;
}

export function SubTestTimer({ initialSeconds, onExpire, isActive }: SubTestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Handle expiration
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      onExpire();
    }
  }, [timeLeft, isActive, onExpire]);

  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.max(0, timeLeft) % 60;

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full border bg-white shadow-sm transition-colors",
      timeLeft < 60 ? "border-destructive text-destructive animate-pulse" : "border-accent text-accent-foreground"
    )}>
      <TimerIcon className="w-5 h-5" />
      <span className="font-mono text-xl font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}