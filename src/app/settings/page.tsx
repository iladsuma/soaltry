
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Settings2, FileJson, Save, RotateCcw, Upload, Info, BarChart3, Bug } from "lucide-react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function SettingsPage() {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState("");
  const [stats, setStats] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);

  const subtestKeys = ["lang_fast", "lang_tricky", "gen_fast", "gen_random", "calc_easy", "calc_mixed"];

  const calculateStats = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const newStats: Record<string, number> = {};
      let total = 0;
      
      subtestKeys.forEach(key => {
        const count = Array.isArray(parsed[key]) ? parsed[key].length : 0;
        newStats[key] = count;
        total += count;
      });

      setStats(newStats);
      setTotalCount(total);
    } catch (e) {
      setStats({});
      setTotalCount(0);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("custom_exam_questions");
    if (saved) {
      setJsonInput(saved);
      calculateStats(saved);
    }
  }, []);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const missingKeys = subtestKeys.filter(key => !parsed[key]);
      
      if (missingKeys.length > 0) {
        toast({
          title: "Format Tidak Lengkap",
          description: `JSON harus memiliki kunci: ${missingKeys.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("custom_exam_questions", jsonInput);
      calculateStats(jsonInput);
      
      toast({
        title: "Berhasil Disimpan",
        description: `Bank soal kustom aktif dengan total ${totalCount} soal.`,
      });
    } catch (e) {
      toast({
        title: "Format JSON Salah",
        description: "Pastikan teks yang Anda masukkan adalah JSON yang valid.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem("custom_exam_questions");
    setJsonInput("");
    setStats({});
    setTotalCount(0);
    toast({
      title: "Reset Berhasil",
      description: "Aplikasi sekarang menggunakan bank soal bawaan.",
    });
  };

  const simulatePermissionError = () => {
    const error = new FirestorePermissionError({
      path: '/databases/(default)/documents/bank_soal/custom_data',
      operation: 'update',
      requestResourceData: { totalQuestions: totalCount, lastUpdated: new Date().toISOString() }
    });
    errorEmitter.emit('permission-error', error);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      calculateStats(content);
      toast({
        title: "File Terunggah",
        description: "Klik Simpan untuk menerapkan perubahan.",
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Manajemen Bank Soal</h1>
              <p className="text-muted-foreground">Konfigurasi 6 sub-tes (Total Target 228 Soal).</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-dashed" onClick={simulatePermissionError}>
              <Bug className="w-4 h-4 mr-2" /> Simulasi Error
            </Button>
            <Settings2 className="w-8 h-8 text-accent opacity-50" />
          </div>
        </header>

        {totalCount > 0 && (
          <Card className="border-primary bg-primary/5 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <BarChart3 className="w-5 h-5" />
                  <span>Status Bank Soal Aktif</span>
                </div>
                <div className="px-4 py-1 bg-primary text-white rounded-full font-black text-xl shadow-lg">
                  {totalCount} <span className="text-xs font-normal opacity-80 uppercase">Soal</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subtestKeys.map(key => (
                  <div key={key} className="flex justify-between items-center p-3 rounded-xl bg-white border shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{key.replace('_', ' ')}</span>
                    <span className="font-black text-primary">{stats[key] || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Editor JSON (6 Sub-Tes)
            </CardTitle>
            <CardDescription>
              Tempelkan 228 soal kognitif yang telah dibagi ke dalam 6 kategori spesifik.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="json-input" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Data JSON</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-3 h-3" /> Unggah .json
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1 text-destructive hover:text-destructive"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </Button>
                </div>
              </div>
              <Textarea
                id="json-input"
                placeholder='{ "lang_fast": [...], "lang_tricky": [...], ... }'
                className="min-h-[400px] font-mono text-xs leading-relaxed"
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  calculateStats(e.target.value);
                }}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/">
                <Button variant="ghost">Batal</Button>
              </Link>
              <Button className="bg-primary px-10 gap-2 font-bold shadow-lg" onClick={handleSave}>
                <Save className="w-4 h-4" /> Simpan Bank Soal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
