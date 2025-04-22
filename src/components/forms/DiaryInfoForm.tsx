import React, { useState } from 'react';
import HabitEntry from './HabitEntry';
import { RadioCheckbox } from "@/components/ui/radio-checkbox";
import HabitCard from "@/components/ui/habit-card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select_habit'
import { TextField } from '@/components/ui/text_input_diary';
import { Button } from "@/components/ui/button";

interface Habit {
  id: string;
  name: string;
  measurementType: 'scale' | 'hours' | 'times' | 'yesno';
  frequency: 'daily' | 'weekly' | 'monthly';
  shared: boolean;
  value?: number | boolean;
}

export default function DiaryInfoForm() {
  // Time range selection
  const [timeRange, setTimeRange] = useState<'today' | 'sinceLast'>('today');
  
  // Temporary habits (3 static habits for now)
  const [habits] = useState<Habit[]>([
    { id: '1', name: 'Habit 1', measurementType: 'scale', frequency: 'daily', shared: false },
    { id: '2', name: 'Habit 2', measurementType: 'hours', frequency: 'weekly', shared: false },
    { id: '3', name: 'Habit 3', measurementType: 'yesno', frequency: 'daily', shared: false }
  ]);

  const [checkboxStates, setCheckboxStates] = useState({
    demo1: false,
    demo2: true,
    demo3: false
  });

  // Handler to update checkbox state
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxStates(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const [toggleState, setToggleState] = useState(false);
  const [labeledToggleState, setLabeledToggleState] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [value, setValue] = useState('');

  // Pre-set questions with proper measurement types
  const generalQuestions = [
    { id: 'sleep', name: 'Qualidade do sono', measurementType: 'scale', frequency: 'daily' },
    { id: 'medicine', name: 'Tomar medicamentos', measurementType: 'yesno', frequency: 'daily' },
    { id: 'effects', name: 'Efeitos da medicação', measurementType: 'scale', frequency: 'weekly' },
    { id: 'sideEffects', name: 'Efeitos colaterais da medicação', measurementType: 'yesno', frequency: 'weekly' },
    { id: 'physicalHealth', name: 'Sintomas físicos', measurementType: 'yesno', frequency: 'daily' },
    { id: 'thoughts', name: 'Pensamentos', measurementType: 'scale', frequency: 'daily' },
    { id: 'exposure', name: 'Exposição a gatilhos', measurementType: 'times', frequency: 'weekly' },
    { id: 'work', name: 'Trabalho', measurementType: 'scale', frequency: 'weekly' },
    { id: 'domestic', name: 'Tarefas domésticas', measurementType: 'scale', frequency: 'weekly' },
    { id: 'food', name: 'Alimentação', measurementType: 'scale', frequency: 'weekly' },
    { id: 'hobbies', name: 'Hobbies', measurementType: 'scale', frequency: 'weekly' },
    { id: 'exercise', name: 'Exercício físico', measurementType: 'hours', frequency: 'weekly' },
    { id: 'water', name: 'Consumo de água', measurementType: 'scale', frequency: 'daily' },
    { id: 'socialization', name: 'Socialização', measurementType: 'scale', frequency: 'daily' },
    { id: 'selfHarm', name: 'Auto mutilação', measurementType: 'times', frequency: 'daily' },
    { id: 'instrusiveThoughts', name: 'Pensamentos intrusivos', measurementType: 'scale', frequency: 'daily' },
    { id: 'suicideIdeation', name: 'Ideação suicida', measurementType: 'yesno', frequency: 'daily' },
    { id: 'dissociation', name: 'Disassociação', measurementType: 'scale', frequency: 'daily' },
    { id: 'paranoia', name: 'Paranóia', measurementType: 'scale', frequency: 'daily' },
  ];
  
  // Free text
  const [freeText, setFreeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ timeRange, habits, generalQuestions, freeText });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="h-[1px] bg-white" />

      {/* Time Range Selection */}
      <div className="space-y-2" style={{ marginLeft: '32px' }}>
        <h3 
          className="font-semibold text-[16px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#3F414E'
          }}
        >
          A qual período de tempo esse diário se refere?
        </h3>
        <div className="flex flex-col gap-4">
          <RadioCheckbox
            id="demo1"
            label="Hoje"
            checked={checkboxStates.demo1}
            onCheckedChange={(checked) => handleCheckboxChange('demo1', checked)}
          />
          <RadioCheckbox
            id="demo2"
            label="Desde o último diário"
            checked={checkboxStates.demo2}
            onCheckedChange={(checked) => handleCheckboxChange('demo2', checked)}
          />
        </div>
      </div>

      {/* Habits Section */}
      <div className="space-y-2" style={{ marginLeft: '32px' }}>
        <h3 
          className="font-semibold text-[16px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#3F414E'
          }}
        >
          Com que frequência você fez seus hábitos?
        </h3>
        <div className="flex items-center gap-2" style={{ marginLeft: '12px' }}>
          <h3 
            className="font-normal text-[14px]"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#A1A4B2'
            }}
          >
            Compartilhar com profissionais da saúde
          </h3>
          <Switch 
            checked={toggleState} 
            onCheckedChange={setToggleState} 
          />
        </div>
      </div>

      {/* Static Habits (3 placeholder habits) */}
      {habits.map((habit, index) => (
        <div key={habit.id} className="flex w-full ml-[36px] mr-[4px] mb-4">
          <div className="w-[70%]">
            <HabitCard title={habit.name} />
          </div>
          <div className="w-[30%] pl-4">
            <Select onValueChange={(val) => setSelectValue(val)} value={selectValue}>
              <SelectTrigger hasSelection={!!selectValue} size="sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      {/* Pre-set Questions Section */}
      <div className="space-y-2" style={{ marginLeft: '32px' }}>
        <h3 
          className="font-semibold text-[16px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#3F414E'
          }}
        >
          Bem-estar geral:
        </h3>
        
        {generalQuestions.map((question, index) => (
          <div key={question.id} className="flex w-full mr-[4px] mb-4">
            <div className="w-[70%]">
              <HabitCard title={question.name} />
            </div>
            <div className="w-[30%] pl-4">
              <Select>
                <SelectTrigger hasSelection={true} size="sm">
                  <SelectValue placeholder={question.measurementType === 'scale' ? '1-10' : 
                                          question.measurementType === 'yesno' ? 'Sim/Não' : 
                                          question.measurementType === 'hours' ? 'Horas' : 'Vezes'} />
                </SelectTrigger>
                <SelectContent>
                  {question.measurementType === 'scale' ? (
                    Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                    ))
                  ) : question.measurementType === 'yesno' ? (
                    <>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </>
                  ) : (
                    Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      {/* Free Text Section */}
      <div className="space-y-2" style={{ marginLeft: '32px' }}>
        <h3 
          className="font-semibold text-[16px]"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: '#3F414E'
          }}
        >
          Texto
        </h3>
        <div className="flex items-center gap-2" style={{ marginLeft: '12px' }}>
          <h3 
            className="font-normal text-[14px]"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#A1A4B2'
            }}
          >
            Compartilhar com profissionais da saúde
          </h3>
          <Switch 
            checked={toggleState} 
            onCheckedChange={setToggleState} 
          />
        </div>
      </div>
      <div className="space-y-2" style={{ marginLeft: '32px' }}>
        <TextField
          size="large"
          multiline
          variant="static-orange"
          label=""
          placeholder=""
        />
      </div>

      {/* Submit Button */}
      <div className="px-[32px]">
        <Button variant="orange" size="responsive">
          SALVAR
        </Button>
      </div>
    </form>
  );
}