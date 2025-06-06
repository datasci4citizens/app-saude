import DiaryInfoForm from "@/pages/patient/diary/DiaryInfoForm";
import Header from "@/components/ui/header";
import { useNavigate } from "react-router-dom";

export default function DiaryPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/diary");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-primary">
      <Header title="Novo Diário" onBackClick={handleBackClick} />
      <div className="w-full mt-4">
        <DiaryInfoForm />
      </div>
    </div>
  );
}
