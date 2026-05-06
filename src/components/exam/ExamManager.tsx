"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SUBTESTS, Question } from "@/lib/types";
import { languageQuestions, patternQuestions, abstractionQuestions, spatialQuestions } from "@/lib/mock-data";
import { generateCalculationProblems } from "@/ai/flows/generate-calculation-problems";
import { generateGeneralKnowledgeQuestions } from "@/ai/flows/generate-general-knowledge-questions";
import { SubTestTimer } from "./SubTestTimer";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExamManager() {
  const { toast } = useToast();
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestionsRecord, setAllQuestionsRecord] = useState<Question[]>([]);
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
      // Simpan record soal untuk perhitungan skor di akhir
      setAllQuestionsRecord(prev => {
        const filtered = prev.filter(p => !loaded.find(l => l.id === p.id));
        return [...filtered, ...loaded];
      });
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
    await new Promise(resolve => setTimeout(resolve, 800));
    const isGlitch = Math.random() < 0.4;

    if (isGlitch) {
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
      return;
    }

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

  const finalResults = useMemo(() => {
    if (!isCompleted) return null;
    
    let score = 0;
    allQuestionsRecord.forEach(q => {
      const userAnswer = answers[q.id];
      // Bandingkan jawaban (case insensitive jika string)
      if (String(userAnswer).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
        score += 1;
      }
    });

    return {
      totalScore: score,
      maxPossible: allQuestionsRecord.length,
      answeredCount: Object.keys(answers).length
    };
  }, [isCompleted, allQuestionsRecord, answers]);

  if (isCompleted && finalResults) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black text-primary">Ujian Selesai!</h1>
          <p className="text-muted-foreground text-lg">Berikut adalah rangkuman performa kognitif Anda.</p>
        </div>

        <Card className="w-full max-w-md border-primary/20 shadow-2xl overflow-hidden">
          <div className="bg-primary p-6 text-white">
            <div className="text-sm font-bold uppercase tracking-widest opacity-80">Skor Total</div>
            <div className="text-6xl font-black">{finalResults.totalScore}</div>
            <div className="text-xs mt-1 font-medium italic opacity-70">Satu poin per jawaban benar</div>
          </div>
          <CardContent className="p-6 grid grid-cols-2 gap-4 divide-x">
            <div className="text-center">
              <div className="text-2xl font-bold">{finalResults.maxPossible}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Total Soal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{finalResults.answeredCount}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Soal Terjawab</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button size="lg" className="rounded-full shadow-lg" onClick={() => window.location.href = "/"}>
            Kembali ke Beranda
          </Button>
          <Button variant="ghost" className="text-muted-foreground text-xs" onClick={() => window.location.reload()}>
            Coba Ujian Lagi
          </Button>
        </div>
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
      
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-30">
        <AlertCircle className="w-3 h-3" />
        Sistem Stabilizer: Active (Low Confidence)
      </div>
    </div>
  );
}
