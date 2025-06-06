import DiaryInfoForm from "@/pages/patient/diary/DiaryInfoForm";
import Header from "@/components/ui/header";

export default function DiaryPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-primary">
      <Header title="Diário" />
      <div className="w-full mt-4">
        <DiaryInfoForm />
      </div>
    </div>
  );
}
