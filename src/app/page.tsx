import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Timer, CheckSquare, Zap, Target, Layers } from "lucide-react";

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
            <Button variant="ghost" className="text-muted-foreground font-bold">Bank Soal (228)</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground font-bold text-sm border border-accent/20">
            <Zap className="w-4 h-4 text-accent" />
            Simulasi Kognitif 6 Sub-Tes Intensif
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black leading-tight tracking-tighter text-foreground">
            Akurasi <span className="text-primary">Intelektual</span> Tanpa Batas.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uji refleks dan ketelitian Anda dengan <b>228 soal</b> yang dibagi ke dalam 6 dimensi kognitif: Bahasa, Hitungan, dan Pengetahuan Umum dengan tingkat kesulitan bertingkat.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/exam">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                Mulai Ujian Intensif
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <FeatureCard 
            icon={<Target className="w-6 h-6" />} 
            title="6 Dimensi Taktis" 
            desc="Bahasa (Fast/Tricky), Umum (Fast/Random), dan Hitungan (Easy/Mixed)." 
          />
          <FeatureCard 
            icon={<Timer className="w-6 h-6" />} 
            title="Sistem 7 Menit" 
            desc="Timer ketat per kategori untuk melatih tekanan mental dan manajemen waktu." 
          />
          <FeatureCard 
            icon={<Layers className="w-6 h-6" />} 
            title="228 Soal Terstruktur" 
            desc="Volume soal besar untuk simulasi ujian profesional yang sesungguhnya." 
          />
        </div>
      </main>

      <footer className="p-8 text-muted-foreground text-sm font-medium">
        © 2024 CogniFlow. Developed for High-Performance Intellectual Testing.
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
