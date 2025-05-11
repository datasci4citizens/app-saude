import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select_habit';
import { TextField } from '@/components/ui/text_input_diary';
import { Button } from "@/components/forms/button";

interface TrackableItem {
  id: string;
  name: string;
  measurementType: 'scale' | 'hours' | 'times' | 'yesno';
  value?: string;
}

export default function DiaryInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | 'sinceLast'>('sinceLast');
  const [freeText, setFreeText] = useState('');
  
  const [shareHabits, setShareHabits] = useState(false);
  const [shareWellBeing, setShareWellBeing] = useState(false);
  const [shareText, setShareText] = useState(false);

  const [habits, setHabits] = useState<TrackableItem[]>([]);

  const [wellBeingQuestions] = useState<TrackableItem[]>([
    { id: 'sleep', name: 'Qualidade do sono', measurementType: 'scale' },
    { id: 'medicine', name: 'Tomar medicamentos', measurementType: 'yesno' },
    { id: 'medication_effects', name: 'Efeitos da medicação', measurementType: 'scale' },
    { id: 'side_effects', name: 'Efeitos colaterais da medicação', measurementType: 'yesno' },
    { id: 'physical_symptoms', name: 'Sintomas físicos', measurementType: 'yesno' },
    { id: 'thoughts', name: 'Pensamentos', measurementType: 'scale' },
    { id: 'triggers', name: 'Exposição a gatilhos', measurementType: 'times' },
    { id: 'work', name: 'Trabalho', measurementType: 'scale' },
    { id: 'chores', name: 'Tarefas domésticas', measurementType: 'scale' },
    { id: 'food', name: 'Alimentação', measurementType: 'scale' },
    { id: 'hobbies', name: 'Hobbies', measurementType: 'scale' },
    { id: 'exercise', name: 'Exercício físico', measurementType: 'hours' },
    { id: 'water', name: 'Consumo de água', measurementType: 'scale' },
    { id: 'social', name: 'Socialização', measurementType: 'scale' },
    { id: 'self_harm', name: 'Auto mutilação', measurementType: 'times' },
    { id: 'intrusive_thoughts', name: 'Pensamentos intrusivos', measurementType: 'scale' },
    { id: 'suicidal_ideation', name: 'Ideação suicida', measurementType: 'yesno' },
    { id: 'dissociation', name: 'Disassociação', measurementType: 'scale' },
    { id: 'paranoia', name: 'Paranóia', measurementType: 'scale' }
  ]);

  useEffect(() => {
    if (location.state?.newHabit) {
      setHabits(prev => [...prev, location.state.newHabit]);
    }
  }, [location.state]);

  const handleItemChange = (items: TrackableItem[], setItems: React.Dispatch<React.SetStateAction<TrackableItem[]>>, itemId: string, value: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, value } : item
    ));
  };

  const handleAddHabit = () => {
    navigate('/modify-habits'); // Changed from '/create-habit' to '/modify-habits'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = {
        timeRange,
        habits: habits.map(habit => ({
          ...habit,
          shared: shareHabits
        })),
        wellBeingQuestions: wellBeingQuestions.map(q => ({
          ...q,
          shared: shareWellBeing
        })),
        freeText,
        textShared: shareText
      };

      console.log('Submitting diary:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(-1);
    } catch (error) {
      console.error('Error saving diary:', error);
      alert('Ocorreu um erro ao salvar o diário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelectOptions = (type: TrackableItem['measurementType']) => {
    switch (type) {
      case 'scale':
        return Array.from({ length: 10 }, (_, i) => (
          <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
        ));
      case 'yesno':
        return (
          <>
            <SelectItem value="yes">Sim</SelectItem>
            <SelectItem value="no">Não</SelectItem>
          </>
        );
      case 'hours':
        return Array.from({ length: 24 }, (_, i) => (
          <SelectItem key={i} value={(i + 1).toString()}>{i + 1}h</SelectItem>
        ));
      case 'times':
        return Array.from({ length: 10 }, (_, i) => (
          <SelectItem key={i} value={(i + 1).toString()}>{i + 1} vez{(i !== 0) ? 'es' : ''}</SelectItem>
        ));
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-neutral-700">
          A qual período de tempo esse diário se refere?
        </h3>
        <div className="flex flex-col gap-3">
          <RadioCheckbox
            id="today"
            label="Hoje"
            checked={timeRange === 'today'}
            onCheckedChange={() => setTimeRange('today')}
          />
          <RadioCheckbox
            id="sinceLast"
            label="Desde o último diário"
            checked={timeRange === 'sinceLast'}
            onCheckedChange={() => setTimeRange('sinceLast')}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-neutral-700">
            Seus Hábitos Personalizados
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Compartilhar com profissionais da saúde
            </span>
            <Switch checked={shareHabits} onCheckedChange={setShareHabits} />
          </div>
        </div>

        {/* Habits content */}
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 min-w-[200px]">
                <HabitCard title={habit.name} />
              </div>
              <div className="w-full md:w-[200px]">
                <Select 
                  value={habit.value}
                  onValueChange={(value) => handleItemChange(habits, setHabits, habit.id, value)}
                >
                  <SelectTrigger hasSelection={!!habit.value}>
                    <SelectValue placeholder={
                      habit.measurementType === 'scale' ? '1-10' : 
                      habit.measurementType === 'yesno' ? 'Sim/Não' : 
                      habit.measurementType === 'hours' ? 'Horas' : 'Vezes'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectOptions(habit.measurementType)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <div 
            className="flex flex-col md:flex-row gap-4 w-full cursor-pointer"
            onClick={handleAddHabit}
          >
          <div className="flex-1 min-w-[200px]">
            <div className="bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors 
                            rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-3xl">+</span>
              </div>
            </div>
            <div className="w-full md:w-[200px] flex items-center justify-center">
              <span className="text-gray-500 text-sm"></span>
            </div>
          </div>
        </div>
      </div>

      {/* well being content */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-neutral-700">
            Bem-estar geral:
          </h3>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">
              Compartilhar com profissionais da saúde
            </span>
            <Switch checked={shareWellBeing} onCheckedChange={setShareWellBeing} />
          </div>
        </div>

        <div className="space-y-4">
          {wellBeingQuestions.map((question) => (
            <div key={question.id} className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 min-w-[200px]">
                <HabitCard title={question.name} />
              </div>
              <div className="w-full md:w-[200px]">
                <Select
                  value={question.value}
                  onValueChange={(value) => handleItemChange(wellBeingQuestions, setWellBeingQuestions, question.id, value)}
                >
                  <SelectTrigger hasSelection={!!question.value}>
                    <SelectValue placeholder={
                      question.measurementType === 'scale' ? '1-10' : 
                      question.measurementType === 'yesno' ? 'Sim/Não' : 
                      question.measurementType === 'hours' ? 'Horas' : 'Vezes'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {renderSelectOptions(question.measurementType)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-neutral-700">Texto</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Compartilhar com profissionais da saúde
            </span>
            <Switch checked={shareText} onCheckedChange={setShareText} />
          </div>
        </div>
        
        {/* Free text */}
        <TextField
          size="large"
          multiline
          variant="static-orange"
          className="w-full"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
      </div>

      {/* button */}
      <div className="text-center">
        <Button 
          variant="orange" 
          size="responsive"
          type="submit"
          disabled={isSubmitting}
          className="mx-auto inline-block"
        >
          {isSubmitting ? 'Salvando...' : 'SALVAR'}
        </Button>
      </div>
    </form>
  );
}