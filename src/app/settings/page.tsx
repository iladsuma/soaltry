"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Settings2, FileJson, Save, RotateCcw, Upload, BarChart3, Bug } from "lucide-react";
import { errorEmitter } from "@/lib/error-emitter";
import { SimulatedPermissionError } from "@/lib/errors";

export default function SettingsPage() {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState("");
  const [detectedKeys, setDetectedKeys] = useState<string[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);

  const calculateStats = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const newStats: Record<string, number> = {};
      const keys = Object.keys(parsed);
      let total = 0;
      
      keys.forEach(key => {
        const count = Array.isArray(parsed[key]) ? parsed[key].length : 0;
        newStats[key] = count;
        total += count;
      });

      setDetectedKeys(keys);
      setStats(newStats);
      setTotalCount(total);
    } catch (e) {
      setDetectedKeys([]);
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
      JSON.parse(jsonInput);
      localStorage.setItem("custom_exam_questions", jsonInput);
      calculateStats(jsonInput);
      
      toast({
        title: "Berhasil Disimpan",
        description: `Bank soal aktif dengan total ${totalCount} soal terdeteksi di ${detectedKeys.length} kategori.`,
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
    setDetectedKeys([]);
    setStats({});
    setTotalCount(0);
    toast({
      title: "Reset Berhasil",
      description: "Aplikasi sekarang menggunakan bank soal bawaan.",
    });
  };

  const simulateGlitchError = () => {
    const error = new SimulatedPermissionError({
      path: '/localstorage/bank_soal/data',
      operation: 'write',
      requestResourceData: { status: "Syncing...", keys: detectedKeys }
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
              <p className="text-muted-foreground">Input soal fleksibel via JSON (Offline).</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-dashed" onClick={simulateGlitchError}>
              <Bug className="w-4 h-4 mr-2" /> Simulasi Error
            </Button>
            <Settings2 className="w-8 h-8 text-accent opacity-50" />
          </div>
        </header>

        <Card className="border-primary bg-primary/5 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <BarChart3 className="w-5 h-5" />
                <span>Statistik Bank Soal</span>
              </div>
              <div className="px-4 py-1 bg-primary text-white rounded-full font-black text-xl shadow-lg">
                {totalCount} <span className="text-xs font-normal opacity-80 uppercase">Soal Terdeteksi</span>
              </div>
            </div>
            
            {detectedKeys.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {detectedKeys.map(key => (
                  <div key={key} className="flex justify-between items-center p-3 rounded-xl border shadow-sm bg-white">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground truncate mr-2" title={key}>{key.replace('_', ' ')}</span>
                    <span className="font-black text-primary">{stats[key]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground italic text-sm">
                Belum ada data soal yang terdeteksi. Silakan tempel JSON atau unggah file.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" />
              Editor JSON Soal
            </CardTitle>
            <CardDescription>
              Masukkan soal Anda dalam format JSON. Anda bisa menggunakan nama kategori apa saja (misal: "koperasi_desa").
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
                placeholder='{ "koperasi_desa": [{ "question": "...", "options": [...], "answer": "..." }] }'
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
