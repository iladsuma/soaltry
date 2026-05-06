"use client";

import { Question } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  value: string | number;
  onChange: (value: string | number) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/10 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/60">
          Pertanyaan Kognitif
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <p className="text-2xl font-semibold leading-tight text-foreground/90">
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
                  "flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group relative",
                  String(value) === option 
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20" 
                    : "border-muted bg-white/50 hover:border-primary/40 hover:bg-accent/5"
                )}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`opt-${idx}`} 
                  className="border-primary h-5 w-5 shrink-0" 
                />
                <span className={cn(
                  "flex-1 text-lg font-medium transition-colors",
                  String(value) === option ? "text-primary" : "text-foreground/70 group-hover:text-foreground"
                )}>
                  {option}
                </span>
                {String(value) === option && (
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-3">
            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Jawaban Anda</Label>
            <Input 
              type="text" 
              placeholder="Masukkan angka atau teks jawaban..." 
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              className="text-xl py-7 px-6 border-2 border-muted focus-visible:border-primary focus-visible:ring-primary/20 transition-all rounded-xl"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
