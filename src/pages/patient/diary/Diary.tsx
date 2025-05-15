import DiaryInfoForm from '@/pages/patient/diary/DiaryInfoForm';
import BackArrow from '@/components/ui/back_arrow';

export default function DiaryPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4"> {/* Reduced py */}
      <div className="mb-4"> {/* Reduced from mb-6 */}
        <BackArrow />
      </div>
      
      <h1 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-4"> {/* Added mb-4 */}
        Diário
      </h1>
      
      <div className="w-full mt-4"> {/* Reduced from mt-8 */}
        <DiaryInfoForm />
      </div>
    </div>
  );
}