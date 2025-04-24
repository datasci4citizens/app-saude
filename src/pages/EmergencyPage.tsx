import { useState } from 'react';
import { TextField } from '@/components/ui/text_input';
import PatientButton from '@/components/ui/patient-button';
import BottomNavigationBar from '@/components/ui/navigator-bar';

export default function EmergencyPage() {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  
  // Sample data based on the image
  const emergencyPatients = [
    {
      name: 'Cláudia Almeida',
      age: 52,
      lastConsult: '31/03/2024',
      lastRegistry: '24/03/2024',
      lastEmergency: '23/03/2024',
    },
    {
      name: 'Amanda de Souza',
      age: 30,
      lastConsult: '31/03/2024', 
      lastRegistry: '25/04/2024',
      lastEmergency: '22/03/2024',
    },
    {
      name: 'Emerson Silva',
      age: 19,
      lastConsult: '31/03/2024',
      lastRegistry: '26/04/2024',
      lastEmergency: '20/03/2024',
    },
    {
      name: 'Enzo Ribeiro',
      age: 72,
      lastConsult: '31/03/2024',
      lastRegistry: '29/04/2024',
      lastEmergency: '29/04/2023',
    }
  ];

  const handleNavigation = (itemId: string) => {
    console.log(`Navigated to ${itemId}`);
    // Handle navigation logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header with back button and title */}
      <header className="p-4 flex items-center">
        <button className="mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold">Emergências</h1>
      </header>

      {/* Search input */}
      <div className="px-4 mb-4">
        <TextField
          id="search"
          name="search"
          label="Buscar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar pacientes..."
        />
      </div>

      {/* Tabs */}
      <div className="px-4 flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'todos' ? 'border-b-2 border-[#FA6E5A] text-[#FA6E5A] font-medium' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          Todos
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'urgentes' ? 'border-b-2 border-[#FA6E5A] text-[#FA6E5A] font-medium' : ''}`}
          onClick={() => setActiveTab('urgentes')}
        >
          Urgentes
        </button>
      </div>

      {/* Emergency patients list */}
      <div className="flex-1 px-4 overflow-auto">
        {emergencyPatients.map((patient, index) => (
          <PatientButton
            key={index}
            variant="emergency"
            name={patient.name}
            age={patient.age}
            lastConsult={patient.lastConsult}
            lastRegistry={patient.lastRegistry}
            lastEmergency={patient.lastEmergency}
            onClick={() => console.log(`Clicked on ${patient.name}`)}
          />
        ))}
      </div>

      {/* Bottom navigation using BottomNavigationBar component */}
      <BottomNavigationBar 
        variant="acs" 
        initialActiveId="emergency" 
        onItemClick={handleNavigation}
      />
    </div>
  );
}