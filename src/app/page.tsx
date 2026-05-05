import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Timer, CheckSquare, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="w-full max-w-6xl p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-2xl font-headline font-black tracking-tight text-primary">CogniFlow</span>
        </div>
        <nav>
          <Link href="/settings">
            <Button variant="ghost" className="text-muted-foreground">Pengaturan</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-bold text-sm border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Platform Try Out Kognitif Modern
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black leading-tight tracking-tighter text-foreground">
            Uji Potensi <span className="text-primary">Intelektual</span> Anda.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            228 soal kognitif terstruktur dalam 6 sub-tes mendalam. Dirancang untuk mengasah kecepatan, ketepatan, dan logika berpikir Anda.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/exam">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                Mulai Ujian Sekarang
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <FeatureCard 
            icon={<Timer className="w-6 h-6" />} 
            title="Terukur & Terjadwal" 
            desc="Sistem timer 7 menit per sub-tes untuk simulasi tekanan ujian yang nyata." 
          />
          <FeatureCard 
            icon={<Layers className="w-6 h-6" />} 
            title="6 Dimensi Kognitif" 
            desc="Mencakup Bahasa, Hitungan, Umum, Pola, Abstraksi, hingga Ruang dan Bentuk." 
          />
          <FeatureCard 
            icon={<CheckSquare className="w-6 h-6" />} 
            title="AI-Powered Questions" 
            desc="Soal hitungan dan pengetahuan umum digenerasi secara cerdas oleh AI." 
          />
        </div>
      </main>

      <footer className="p-8 text-muted-foreground text-sm font-medium">
        © 2024 CogniFlow. Focused intellect for professional success.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/50 border border-white/80 shadow-sm hover:shadow-xl transition-all text-left space-y-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}