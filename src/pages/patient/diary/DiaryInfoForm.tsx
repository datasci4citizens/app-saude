import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | 'sinceLast'>('sinceLast');
  const [freeText, setFreeText] = useState('');
  
  // Sharing switches for each section
  const [shareHabits, setShareHabits] = useState(false);
  const [shareTasks, setShareTasks] = useState(false);
  const [shareWellBeing, setShareWellBeing] = useState(false);
  const [shareText, setShareText] = useState(false);

  // Habits data
  const [habits, setHabits] = useState<TrackableItem[]>([
    { id: '1', name: 'Habit 1', measurementType: 'scale' },
    { id: '2', name: 'Habit 2', measurementType: 'hours' },
    { id: '3', name: 'Habit 3', measurementType: 'yesno' }
  ]);

  // Tasks data
  const [tasks, setTasks] = useState<TrackableItem[]>([
    { id: '1', name: 'Task 1', measurementType: 'scale' },
    { id: '2', name: 'Task 2', measurementType: 'yesno' },
    { id: '3', name: 'Task 3', measurementType: 'times' }
  ]);

  // Well-being questions
  const [wellBeingQuestions, setWellBeingQuestions] = useState<TrackableItem[]>([
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

  const handleItemChange = (items: TrackableItem[], setItems: React.Dispatch<React.SetStateAction<TrackableItem[]>>, itemId: string, value: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!freeText.trim()) {
      alert('Por favor, adicione texto ao diário');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        timeRange,
        habits: habits.map(habit => ({
          ...habit,
          shared: shareHabits
        })),
        tasks: tasks.map(task => ({
          ...task,
          shared: shareTasks
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time Range Selection */}
      <div className="space-y-2 ml-[32px]">
        <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
          A qual período de tempo esse diário se refere?
        </h3>
        <div className="flex flex-col gap-4">
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

      {/* Habits Section */}
      <div className="space-y-2 ml-[32px]">
        <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
          Com que frequência você fez seus hábitos?
        </h3>
        <div className="flex items-center gap-2 ml-[12px]">
          <h3 className="font-normal text-[14px] font-inter text-[#A1A4B2]">
            Compartilhar com profissionais da saúde
          </h3>
          <Switch checked={shareHabits} onCheckedChange={setShareHabits} />
        </div>
      </div>

      {/* Habits List */}
      {habits.map((habit) => (
        <div key={habit.id} className="flex w-full ml-[36px] mr-[4px] mb-4">
          <div className="w-[70%]">
            <HabitCard title={habit.name} />
          </div>
          <div className="w-[30%] pl-4">
            <Select 
              value={habit.value}
              onValueChange={(value) => handleItemChange(habits, setHabits, habit.id, value)}
            >
              <SelectTrigger hasSelection={!!habit.value} size="sm">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {renderSelectOptions(habit.measurementType)}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {/* Tasks Section */}
      <div className="space-y-2 ml-[32px]">
        <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
          Com que frequência você fez suas tarefas?
        </h3>
        <div className="flex items-center gap-2 ml-[12px]">
          <h3 className="font-normal text-[14px] font-inter text-[#A1A4B2]">
            Compartilhar com profissionais da saúde
          </h3>
          <Switch checked={shareTasks} onCheckedChange={setShareTasks} />
        </div>
      </div>

      {/* Tasks List */}
      {tasks.map((task) => (
        <div key={task.id} className="flex w-full ml-[36px] mr-[4px] mb-4">
          <div className="w-[70%]">
            <HabitCard title={task.name} />
          </div>
          <div className="w-[30%] pl-4">
            <Select 
              value={task.value}
              onValueChange={(value) => handleItemChange(tasks, setTasks, task.id, value)}
            >
              <SelectTrigger hasSelection={!!task.value} size="sm">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {renderSelectOptions(task.measurementType)}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {/* Well-being Section */}
      <div className="space-y-2 ml-[32px]">
        <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
          Bem-estar geral:
        </h3>
        <div className="flex items-center gap-2 ml-[12px] mb-4">
          <h3 className="font-normal text-[14px] font-inter text-[#A1A4B2]">
            Compartilhar com profissionais da saúde
          </h3>
          <Switch checked={shareWellBeing} onCheckedChange={setShareWellBeing} />
        </div>
        
        {wellBeingQuestions.map((question) => (
          <div key={question.id} className="flex w-full mr-[4px] mb-4">
            <div className="w-[70%]">
              <HabitCard title={question.name} />
            </div>
            <div className="w-[30%] pl-4">
              <Select
                value={question.value}
                onValueChange={(value) => handleItemChange(wellBeingQuestions, setWellBeingQuestions, question.id, value)}
              >
                <SelectTrigger hasSelection={!!question.value} size="sm">
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

      {/* Free Text Section */}
      <div className="space-y-2 ml-[32px]">
        <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
          Texto
        </h3>
        <div className="flex items-center gap-2 ml-[12px]">
          <h3 className="font-normal text-[14px] font-inter text-[#A1A4B2]">
            Compartilhar com profissionais da saúde
          </h3>
          <Switch checked={shareText} onCheckedChange={setShareText} />
        </div>
      </div>
      
      <div className="space-y-2 ml-[32px]">
        <TextField
          size="large"
          multiline
          variant="static-orange"
          label=""
          placeholder=""
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="px-[32px]">
        <Button 
          variant="orange" 
          size="responsive"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'SALVAR'}
        </Button>
      </div>
    </form>
  );
}