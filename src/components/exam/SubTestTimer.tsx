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
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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