"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SUBTESTS, Question, SubTestType } from "@/lib/types";
import defaultExamData from "@/lib/exam-questions.json";
import { SubTestTimer } from "./SubTestTimer";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, Trophy, AlertCircle, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [isCustomMode, setIsCustomMode] = useState(false);

  const currentSubTest = SUBTESTS[currentSubIndex];

  // Memuat soal dari storage atau default
  const loadQuestions = useCallback(() => {
    setIsLoading(true);
    const config = SUBTESTS[currentSubIndex];
    
    let activeData = defaultExamData;
    const customSaved = localStorage.getItem("custom_exam_questions");
    
    if (customSaved) {
      try {
        activeData = JSON.parse(customSaved);
        setIsCustomMode(true);
      } catch (e) {
        console.error("Gagal memuat soal kustom, menggunakan default.");
        setIsCustomMode(false);
      }
    } else {
      setIsCustomMode(false);
    }

    const rawData = (activeData as any)[config.id] || [];
    
    const loaded: Question[] = rawData.map((q: any, i: number) => ({
      ...q,
      id: `${config.id}-${currentSubIndex}-${i}`,
      type: config.id as SubTestType
    }));

    setQuestions(loaded);
    
    setAllQuestionsRecord(prev => {
      const filtered = prev.filter(p => !loaded.find(l => l.id === p.id));
      return [...filtered, ...loaded];
    });

    setIsLoading(false);
  }, [currentSubIndex]);

  useEffect(() => {
    loadQuestions();
    setCurrentQIndex(0);
  }, [loadQuestions]);

  const handleNextSubTest = useCallback(() => {
    if (currentSubIndex < SUBTESTS.length - 1) {
      setCurrentSubIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentSubIndex]);

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    const currentQ = questions[currentQIndex];
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // REPLIKASI GLITCH KOPDES (Ganti jawaban secara acak 10% kemungkinan)
    const isGlitch = Math.random() < 0.1;
    if (isGlitch && currentQ && currentQ.options) {
      const otherOptions = currentQ.options.filter(o => o !== answers[currentQ.id]);
      const randomOption = otherOptions[Math.floor(Math.random() * otherOptions.length)];
      setAnswers(prev => ({ ...prev, [currentQ.id]: randomOption }));
      
      setIsSaving(false);
      toast({
        title: "Sync Anomaly",
        description: "Data tersinkronisasi dengan penyesuaian otomatis.",
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
      if (userAnswer && String(userAnswer).trim().toLowerCase() === String(q.answer).trim().toLowerCase()) {
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
          <h1 className="text-4xl font-headline font-black text-primary">Hasil Akhir</h1>
          <p className="text-muted-foreground text-lg">Performa kognitif terakumulasi.</p>
        </div>
        <Card className="w-full max-w-md border-primary/20 shadow-2xl overflow-hidden">
          <div className="bg-primary p-8 text-white">
            <div className="text-sm font-bold uppercase tracking-widest opacity-80">Skor Anda</div>
            <div className="text-7xl font-black">{finalResults.totalScore}</div>
            <div className="text-xs mt-2 opacity-70">1 poin per soal benar</div>
          </div>
          <CardContent className="p-6 grid grid-cols-2 gap-4 divide-x">
            <div className="text-center">
              <div className="text-2xl font-bold">{finalResults.maxPossible}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Total Soal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{finalResults.answeredCount}</div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground">Terjawab</div>
            </div>
          </CardContent>
        </Card>
        <Button size="lg" className="rounded-full px-12" onClick={() => window.location.href = "/"}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const progressPercent = ((currentSubIndex * 100) + ((currentQIndex / Math.max(1, questions.length)) * 100)) / SUBTESTS.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-5 rounded-2xl border shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Sub-Tes {currentSubIndex + 1} / {SUBTESTS.length}</span>
          <h2 className="text-2xl font-headline font-bold text-primary">{currentSubTest.name}</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
            <Database className="w-3 h-3 text-primary" />
            <span className={isCustomMode ? "text-accent" : "text-muted-foreground"}>
              {isCustomMode ? "Bank Soal Kustom Aktif" : "Bank Soal Default"}
            </span>
          </div>
        </div>
        <SubTestTimer 
          key={`timer-${currentSubIndex}`}
          initialSeconds={currentSubTest.duration} 
          onExpire={handleNextSubTest} 
          isActive={!isLoading && !isCompleted}
        />
      </div>

      <Progress value={progressPercent} className="h-2 bg-white border" />

      <div className="min-h-[400px] flex flex-col justify-center">
        {!isLoading && questions.length > 0 ? (
          <QuestionCard 
            key={questions[currentQIndex]?.id} 
            question={questions[currentQIndex]} 
            value={answers[questions[currentQIndex]?.id] || ''} 
            onChange={updateAnswer} 
          />
        ) : (
          <div className="text-center p-12 bg-white rounded-xl border border-dashed flex flex-col items-center gap-4">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-muted-foreground">Tidak ada soal tersedia untuk kategori ini.</p>
                <Link href="/settings">
                  <Button variant="outline">Periksa Pengaturan</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-dashed">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Soal {currentQIndex + 1} dari {questions.length}
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="rounded-full px-8"
            onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQIndex === 0 || isLoading || isSaving}
          >
            Kembali
          </Button>
          <Button 
            className="rounded-full px-10 shadow-lg bg-primary hover:bg-primary/90"
            onClick={handleSaveAndContinue}
            disabled={isLoading || isSaving || questions.length === 0}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Simpan & Lanjut <ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
