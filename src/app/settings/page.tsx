"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft, Settings2, FileJson, Save, RotateCcw, Upload, Info, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("custom_exam_questions");
    if (saved) {
      setJsonInput(saved);
    }
  }, []);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const requiredKeys = ["lang_fast", "lang_tricky", "gen_fast", "gen_random", "calc_easy", "calc_mixed"];
      const missingKeys = requiredKeys.filter(key => !parsed[key]);
      
      if (missingKeys.length > 0) {
        toast({
          title: "Format Tidak Lengkap",
          description: `JSON harus memiliki kunci: ${missingKeys.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("custom_exam_questions", jsonInput);
      toast({
        title: "Berhasil Disimpan",
        description: "Bank soal kustom untuk 6 sub-tes intensif telah aktif.",
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
    toast({
      title: "Reset Berhasil",
      description: "Aplikasi sekarang menggunakan bank soal bawaan.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
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
              <p className="text-muted-foreground">Konfigurasi 6 sub-tes (Total 228 Soal).</p>
            </div>
          </div>
          <Settings2 className="w-8 h-8 text-accent opacity-50" />
        </header>

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pb-4">
              {["lang_fast", "lang_tricky", "gen_fast", "gen_random", "calc_easy", "calc_mixed"].map(key => (
                <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border text-[10px] font-bold uppercase text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-primary" /> {key}
                </div>
              ))}
            </div>

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
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/">
                <Button variant="ghost">Batal</Button>
              </Link>
              <Button className="bg-primary px-10 gap-2 font-bold" onClick={handleSave}>
                <Save className="w-4 h-4" /> Simpan Bank Soal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-dashed border-primary/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" /> Karakteristik 228 Soal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li><b>Bahasa (Fast/Tricky):</b> Sinonim kilat & Pemahaman makna tersirat.</li>
              <li><b>Umum (Fast/Random):</b> Fakta instan & Wawasan luas bervariasi.</li>
              <li><b>Hitungan (Easy/Mixed):</b> Aritmatika refleks & Analisis taktis.</li>
              <li>Setiap kategori idealnya memiliki <b>38 soal</b> untuk mencapai total 228.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
