import { Button } from "@/components/ui/button";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import PatientsPage from "@/components/ui/patient-button";
import HomeBanner from "@/components/home-banner";
import InfoCard from "@/components/ui/info-card";
import HabitCard from "@/components/ui/habit-card";
import { RadioCheckbox } from "@/components/ui/radio-checkbox";
import { Switch } from "@/components/ui/switch";
import { LabeledSwitch } from "@/components/ui/labeled-switch";
import { TextField } from '@/components/ui/text_input'; 
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import PatientCard from '@/components/ui/patient_cards_home';
import BackArrow from "@/components/ui/back_arrow";


export default function ComponentCatalog() {
  // variables of the checkboxes
  const [checkboxStates, setCheckboxStates] = useState({
    demo1: false,
    demo2: true,
    demo3: false
  });

  // variables of the switches
  const [toggleState, setToggleState] = useState(false);
  const [labeledToggleState, setLabeledToggleState] = useState(false);

  // Handler to update checkbox state
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxStates(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const [fieldValues, setFieldValues] = useState({
    medium: '',
    compact: '',
    large: ''
  });

  const [selectValue, setSelectValue] = useState('');


  return (
    <div className="p-6 max-w-4xl mx-auto mx-auto overflow-y-auto" style={{height: '100vh'}}>
      <h1 className="text-3xl font-bold mb-8">Catálogo de Componentes UI</h1>
      
      {/* Seção de Botões */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Botões</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Variantes</h3>
        <div className="flex flex-wrap justify-center">
          <Button variant="orange" size='responsive' position='bottom'>orange</Button>
          <Button variant="white" size='responsive' position='bottom'>white</Button>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">cards de pacientes</h2>
        <div className='flex flex-wrap justify-center'>
            <PatientsPage 
              variant="patient" 
              name="Nome do Paciente"
              age={25}
              lastConsult="01/05/2023"
              lastRegistry="10/05/2023"
              lastEmergency="Não há"
            />
            <PatientsPage 
              variant="emergency" 
              name="Paciente de Emergência"
              age= {30}
              lastConsult="15/05/2023"
              lastRegistry="15/05/2023"
              lastEmergency="15/05/2023"
            />
        </div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">home banners</h2>
        <div className='flex flex-wrap justify-center'>
            <HomeBanner />
            <HomeBanner 
              subtitle="Cheque registro dos seus pacientes"
            />
        </div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">alertas</h2>
        <div className='flex flex-wrap justify-center'>
            <InfoCard
              variant="emergency"
              count={5}
              onClick={() => alert('Ver Emergências')}
            />
            <InfoCard
              variant="appointment"
              name="Amanda de Souza"
              date="15/05/2023"
              time="14:30"
              onClick={() => alert('Ver Consulta')}
            />
        </div>
        <div>
          <HabitCard number={1} />
          <HabitCard number={2} />
          <HabitCard number={3} title="Atividade"/> 
        </div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Task Bar</h2>
        <div className='flex flex-wrap justify-center'>
            <BottomNavigationBar variant="user"/>
            {/* não é possível colocar as duas devido a ficarem fixas na parte de baixo da página */}
        </div>

      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Checkbox</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Variantes</h3>
        <div className='flex flex-wrap justify-center gap-4'>
          <RadioCheckbox
           id="demo1"
            label="Label"
            checked={checkboxStates.demo1}
            onCheckedChange={(checked) => handleCheckboxChange('demo1', checked)}
            />
          <RadioCheckbox
           id="demo2"
           label="Checked"
           checked={checkboxStates.demo2}
           onCheckedChange={(checked) => handleCheckboxChange('demo2', checked)}
           />
          <RadioCheckbox
           id="demo-checkbox-checked"
           label="Try clicking!"
           checked={checkboxStates.demo3}
           onCheckedChange={(checked) => handleCheckboxChange('demo3', checked)}
           />
        </div>
      </section>

          {/* Seção de Switch */}
          <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Toggle Switch</h2>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Standalone Switch</h3>
      <div className='flex justify-center mb-8'>
        <Switch 
          checked={toggleState} 
          onCheckedChange={setToggleState} 
        />
      </div>
      
      <h3 className="text-lg font-medium mt-4 mb-2">Labeled Switch</h3>
      <div className='flex justify-center mb-24'>
        <div className='w-full max-w-md'>
          <LabeledSwitch 
            label="Compartilhar esses dados com profissionais de saúde"
            checked={labeledToggleState}
            onCheckedChange={setLabeledToggleState}
          />
        </div>
      </div>
    </section>


      {/* Text input section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Text Field Variants</h2>
        
        <div className="space-y-8">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Orange- standard size</h3>
            <TextField
              size="medium"
              label="Put input here"
              placeholder=""
              variant="static-orange"
            />
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Changes to orange upon input</h3>
            <TextField
              size="medium"
              label="Put input here"
              placeholder=""
              variant="dynamic-gray-to-orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Compact</h3>
              <TextField
                size="compact"
                variant="static-orange"
                label="Compact Orange"
                placeholder=""
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-4">Large</h3>
              <TextField
                size="large"
                multiline
                variant="dynamic-gray-to-orange"
                label="Multiline"
                placeholder=""
              />
            </div>
          </div>
        </div>
      </section>


      {/* Select section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Select Components</h2>
        
        <div className="space-y-8">
          {/* Basic Select */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Bigger Select</h3>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger className="w-[145px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scrollable Select */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Smaller Select with scroll</h3>
            <Select>
              <SelectTrigger className="w-[92px]">
                <SelectValue placeholder="1/10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">1/10</SelectItem>
                <SelectItem value="option2">2/10</SelectItem>
                <SelectItem value="option3">3/10</SelectItem>
                <SelectItem value="option1">4/10</SelectItem>
                <SelectItem value="option2">5/10</SelectItem>
                <SelectItem value="option1">6/10</SelectItem>
                <SelectItem value="option2">7/10</SelectItem>
                <SelectItem value="option3">8/10</SelectItem>
                <SelectItem value="option1">9/10</SelectItem>
                <SelectItem value="option2">10/10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>


      {/* Patient Cards Section (medicine and appointments) */}
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Patient Cards</h2>
      <div className='flex flex-wrap justify-center gap-4'>
        <PatientCard
          variant="medicine"
          title="Remédios"
          items={[
            { name: 'Paracetamol', date: '08:00' },
            { name: 'Ibuprofeno', date: '12:00' },
            { name: 'Omeprazol', date: '20:00' }
          ]}
          onClick={() => alert('Ver Medicação')}
        />
        <PatientCard
          variant="appointment"
          title="Consultas"
          items={[
            { name: 'Dr. Silva', date: '15/05 - 14:30' },
            { name: 'Dra. Oliveira', date: '17/05 - 10:00' },
            { name: 'Dr. Santos', date: '20/05 - 16:15' }
          ]}
          onClick={() => alert('Ver Consultas')}
        />
      </div>


      {/* Back Arrow Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Navigation</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Back Arrow</h3>
        <div className="flex justify-center">
          <BackArrow onClick={() => alert('Back button clicked!')} />
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Navigation</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Back Arrow</h3>
        <div className="flex justify-center">
          <BackArrow onClick={() => alert('Back button clicked!')} />
        </div>
      </section>
    </div>
  );
}