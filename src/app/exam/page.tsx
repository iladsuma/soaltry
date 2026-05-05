import { ExamManager } from "@/components/exam/ExamManager";

export default function ExamPage() {
  return (
    <div className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <ExamManager />
      </div>
    </div>
  );
}