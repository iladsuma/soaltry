import { SUBTESTS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Pengaturan Ujian</h1>
              <p className="text-muted-foreground">Konfigurasi struktur sub-tes dan ambang batas.</p>
            </div>
          </div>
          <Settings2 className="w-8 h-8 text-accent opacity-50" />
        </header>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Struktur Sub-Tes</CardTitle>
            <CardDescription>Ubah durasi dan jumlah soal untuk setiap kategori ujian.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {SUBTESTS.map((sub) => (
                <div key={sub.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg bg-white/40">
                  <div className="font-bold text-primary">{sub.name}</div>
                  <div className="space-y-1">
                    <Label className="text-xs">Durasi (Detik)</Label>
                    <Input defaultValue={sub.duration} type="number" className="h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Jumlah Soal</Label>
                    <Input defaultValue={sub.totalQuestions} type="number" className="h-8" />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 flex justify-end gap-3">
                <Link href="/">
                  <Button variant="outline">Batal</Button>
                </Link>
                <Button className="bg-primary px-8">Simpan Perubahan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg">Bank Soal Kustom</CardTitle>
            <CardDescription>Soal hitungan digenerasi secara otomatis. Untuk sub-tes lainnya, Anda dapat mengunggah file JSON kustom di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                <Settings2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Unggah Berkas Konfigurasi</p>
                <p className="text-sm text-muted-foreground">Format yang didukung: .json, .csv</p>
              </div>
              <Button variant="secondary">Pilih Berkas</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}