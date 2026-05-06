
"use client";

import { Question } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ImageIcon, Info } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  value: string | number;
  onChange: (value: string | number) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-primary/5 overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
          Modul Kognitif
        </CardTitle>
        {question.imageUrl && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-accent">
            <ImageIcon className="w-3 h-3" />
            Visual
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {question.imageUrl && (
          <div className="space-y-3">
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border-4 border-white shadow-inner bg-muted group">
              <Image 
                src={question.imageUrl} 
                alt={question.question}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                data-ai-hint={question.imageHint || "abstract geometry"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/10">
              <Info className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <p className="text-[10px] text-accent-foreground leading-relaxed italic">
                Gambar di atas adalah ilustrasi bantuan. Fokuslah pada logika yang dijelaskan dalam pertanyaan.
              </p>
            </div>
          </div>
        )}
        
        <p className="text-2xl font-bold leading-snug text-foreground tracking-tight">
          {question.question}
        </p>

        {question.options ? (
          <RadioGroup 
            value={String(value)} 
            onValueChange={onChange}
            className="grid gap-3"
          >
            {question.options.map((option, idx) => (
              <Label 
                key={idx} 
                htmlFor={`opt-${idx}`} 
                className={cn(
                  "flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group relative",
                  String(value) === option 
                    ? "border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20 scale-[1.02]" 
                    : "border-muted bg-white/40 hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`opt-${idx}`} 
                  className="border-primary h-5 w-5 shrink-0" 
                />
                <span className={cn(
                  "flex-1 text-lg font-bold transition-colors",
                  String(value) === option ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {option}
                </span>
                {String(value) === option && (
                  <div className="absolute inset-y-0 right-6 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  </div>
                )}
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Respon Jawaban</Label>
            <Input 
              type="text" 
              placeholder="Ketik jawaban Anda di sini..." 
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              className="text-xl py-8 px-6 border-2 border-muted focus-visible:border-primary focus-visible:ring-primary/20 transition-all rounded-2xl bg-white/50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
