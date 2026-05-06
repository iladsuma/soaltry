
"use client";

import { useState, useEffect, useCallback } from "react";
import { SUBTESTS, Question } from "@/lib/types";
import { languageQuestions, patternQuestions, abstractionQuestions, spatialQuestions } from "@/lib/mock-data";
import { generateCalculationProblems } from "@/ai/flows/generate-calculation-problems";
import { generateGeneralKnowledgeQuestions } from "@/ai/flows/generate-general-knowledge-questions";
import { SubTestTimer } from "./SubTestTimer";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ExamManager() {
  const { toast } = useToast();
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentSubTest = SUBTESTS[currentSubIndex];

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    let loaded: Question[] = [];
    const config = SUBTESTS[currentSubIndex];

    try {
      if (config.id === 'calculations') {
        const result = await generateCalculationProblems({ numProblems: config.totalQuestions });
        loaded = result.problems.map((p, i) => ({
          id: `calc-${currentSubIndex}-${i}`,
          type: 'calculations',
          question: p.question,
          answer: p.answer,
        }));
      } else if (config.id === 'general_knowledge') {
        const result = await generateGeneralKnowledgeQuestions({ 
          topics: ['Sejarah', 'Geografi', 'Sains', 'Politik', 'Budaya'],
          count: config.totalQuestions 
        });
        loaded = result.questions.map((q, i) => ({
          id: `gk-${currentSubIndex}-${i}`,
          type: 'general_knowledge',
          question: q.question,
          options: q.options,
          answer: q.answer,
        }));
      } else {
        const mockMap: Record<string, Question[]> = {
          language: languageQuestions,
          patterns: patternQuestions,
          abstraction: abstractionQuestions,
          spatial: spatialQuestions
        };
        loaded = [...(mockMap[config.id] || [])];
        loaded = loaded.map((q, i) => ({ ...q, id: `${q.id}-${currentSubIndex}` }));
      }
      setQuestions(loaded);
    } catch (err) {
      console.error(err);
      toast({ title: "Gagal memuat soal", description: "Pastikan koneksi internet stabil.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [currentSubIndex, toast]);

  useEffect(() => {
    fetchQuestions();
    setCurrentQIndex(0);
  }, [fetchQuestions]);

  const handleNextSubTest = () => {
    if (currentSubIndex < SUBTESTS.length - 1) {
      setCurrentSubIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    const currentQ = questions[currentQIndex];
    
    // REPLIKASI GLITCH KOPDES:
    // 1. Simulasi delay server yang tidak stabil
    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Simulasi probabilitas kegagalan simpan (40% chance)
    const isGlitch = Math.random() < 0.4;

    if (isGlitch) {
      // 3. Efek visual jawaban berubah tepat sebelum error
      if (currentQ && currentQ.options) {
        const randomOption = currentQ.options[Math.floor(Math.random() * currentQ.options.length)];
        setAnswers(prev => ({ ...prev, [currentQ.id]: randomOption }));
      }

      setIsSaving(false);
      toast({
        title: "Koneksi Terputus / Error Server",
        description: "Gagal menyimpan jawaban. Jawaban mungkin tidak tercatat atau berubah. Silakan periksa kembali soal ini.",
        variant: "destructive",
      });
      return; // Berhenti di sini, memaksa user klik lagi atau cek jawaban
    }

    // Jika berhasil (60% chance)
    setIsSaving(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      handleNextSubTest();
    }
  };

  const updateAnswer = (val: string | number) => {
    const q = questions[currentQIndex];
    if (q) {
      setAnswers(prev => ({ ...prev, [q.id]: val }));
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary">Ujian Selesai!</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Terima kasih telah menyelesaikan try out kognitif CogniFlow. Hasil evaluasi Anda sedang diproses.
        </p>
        <Button size="lg" className="px-10 rounded-full" onClick={() => window.location.href = "/"}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];
  const progressPercent = ((currentSubIndex * 100) + ((currentQIndex / Math.max(1, questions.length)) * 100)) / SUBTESTS.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sub-Tes {currentSubIndex + 1} of {SUBTESTS.length}</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-primary">{currentSubTest.name}</h2>
        </div>
        <SubTestTimer 
          initialSeconds={currentSubTest.duration} 
          onExpire={handleNextSubTest} 
          isActive={!isLoading && !isCompleted}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>Progress Keseluruhan</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-white border border-accent/20" />
      </div>

      <div className="min-h-[400px] flex flex-col justify-center">
        {isLoading ? (
          <div className="space-y-4 max-w-2xl mx-auto w-full">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : currentQuestion ? (
          <QuestionCard 
            key={currentQuestion.id} 
            question={currentQuestion} 
            value={answers[currentQuestion.id] || ''} 
            onChange={updateAnswer} 
          />
        ) : (
          <div className="text-center py-10 text-muted-foreground">Tidak ada soal tersedia.</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm font-medium text-muted-foreground">
          Soal {currentQIndex + 1} dari {questions.length}
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1 sm:flex-none rounded-full"
            onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQIndex === 0 || isLoading || isSaving}
          >
            Sebelumnya
          </Button>
          <Button 
            size="lg" 
            className="flex-1 sm:flex-none rounded-full shadow-lg transition-all bg-primary hover:bg-primary/90"
            onClick={handleSaveAndContinue}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Simpan & Lanjut <ArrowRight className="ml-2 w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
      
      {/* Indikator Peringatan untuk menambah nuansa ketegangan */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-30">
        <AlertCircle className="w-3 h-3" />
        Sistem Stabilizer: Active (Low Confidence)
      </div>
    </div>
  );
}
