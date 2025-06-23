import type React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/forms/button';
import {
  SelectField,
  //SelectTrigger,
  //SelectContent,
  //SelectItem,
  //SelectValue,
} from '@/components/forms/select_input';
import { TextField } from '@/components/forms/text_input';
import Header from '@/components/ui/header';
import BottomNavigationBar from '@/components/ui/navigator-bar';

const ModifyHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [habitName, setHabitName] = useState('');
  const [measurementType, setMeasurementType] = useState<'scale' | 'hours' | 'times' | 'yesno'>(
    'scale',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/diary', {
      state: {
        newHabit: {
          id: Date.now().toString(),
          name: habitName,
          measurementType,
        },
      },
    });
  };
  const getActiveNavId = () => {
    if (location.pathname.startsWith('/user-main-page')) return 'home';
    if (location.pathname.startsWith('/reminders')) return 'meds';
    if (location.pathname.startsWith('/diary')) return 'diary';
    if (location.pathname.startsWith('/emergency-user')) return 'emergency';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'home':
        navigate('/user-main-page');
        break;
      case 'meds':
        navigate('/reminders');
        break;
      case 'diary':
        navigate('/diary');
        break;
      case 'emergency':
        navigate('/emergency-user');
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
  };

  // Define measurement type options
  const measurementTypeOptions = [
    { value: 'scale', label: 'Escala (1-10)' },
    { value: 'hours', label: 'Horas' },
    { value: 'times', label: 'Vezes' },
    { value: 'yesno', label: 'Sim/Não' },
  ];

  // Handle change from SelectField
  const handleMeasurementTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMeasurementType(e.target.value as 'scale' | 'hours' | 'times' | 'yesno');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* header */}
      <Header title="Criar Novo Hábito" onBackClick={() => navigate(-1)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Criar Novo Hábito</h2>

        <TextField
          id="habitName"
          name="habitName"
          label="Nome do Hábito"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
        />

        <SelectField
          id="measurementType"
          name="measurementType"
          label="Tipo de Medição"
          value={measurementType}
          options={measurementTypeOptions}
          onChange={handleMeasurementTypeChange}
          isLoading={false}
          placeholder="Selecione o tipo"
        />
        <Button variant="orange" type="submit" className="w-full text-offwhite">
          Criar Hábito
        </Button>
      </form>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
};

export default ModifyHabits;
