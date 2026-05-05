"use client";

import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
  question: Question;
  value: string | number;
  onChange: (value: string | number) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary/80">
          Pertanyaan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-medium leading-relaxed">
          {question.question}
        </p>

        {question.options ? (
          <RadioGroup 
            value={String(value)} 
            onValueChange={onChange}
            className="grid gap-4"
          >
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/10 transition-colors cursor-pointer group">
                <RadioGroupItem value={option} id={`opt-${idx}`} className="border-accent" />
                <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-foreground/80 group-hover:text-foreground">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Jawaban Anda</Label>
            <Input 
              type="text" 
              placeholder="Ketik jawaban di sini..." 
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              className="text-lg py-6 border-accent/30 focus-visible:ring-accent"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}