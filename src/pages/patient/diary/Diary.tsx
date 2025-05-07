import DiaryInfoForm from '@/pages/patient/diary/DiaryInfoForm';
import BackArrow from '@/components/ui/back_arrow';

export default function DiaryPage() {
  return (
    <div className="max-w-md mx-auto p-4">
      {/* Back Arrow */}
      <div className="mb-6">
        <BackArrow />
      </div>
      
      {/* Page Title */}
      <h1 
        className="font-bold text-[28px]"
        style={{
          fontFamily: "'Work Sans', sans-serif",
          color: '#3F414E',
          marginLeft: '32px'
        }}
      >
        Diário
      </h1>
      
      {/* Form */}
      <DiaryInfoForm />
    </div>
  );
}