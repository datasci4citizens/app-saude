import { useState } from 'react';
import { TextField } from '@/components/ui/text_input';
import PatientButton from '@/components/ui/patient-button';
import BottomNavigationBar from '@/components/ui/navigator-bar';

export default function EmergencyPage() {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  
  // Sample data trade for a array of emergency patients
  const emergencyPatients = [
    {
      id: 'claudia123',
      name: 'Cláudia Almeida',
      age: 52,
      lastConsult: '31/03/2024',
      lastRegistry: '24/03/2024',
      lastEmergency: '23/03/2024',
    },
    {
      id: 'amanda456',
      name: 'Amanda de Souza',
      age: 30,
      lastConsult: '31/03/2024', 
      lastRegistry: '25/04/2024',
      lastEmergency: '22/03/2024',
    },
    {
      id: 'emerson789',
      name: 'Emerson Silva',
      age: 19,
      lastConsult: '31/03/2024',
      lastRegistry: '26/04/2024',
      lastEmergency: '20/03/2024',
    },
    {
      id: 'enzo101',
      name: 'Enzo Ribeiro',
      age: 72,
      lastConsult: '31/03/2024',
      lastRegistry: '29/04/2024',
      lastEmergency: '29/04/2023',
    }
  ];

  // Função auxiliar para converter data DD/MM/AAAA para objeto Date
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Filtra pacientes com base na busca
  const filteredBySearch = emergencyPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  // Aplica ordenação por data se estiver na aba urgentes
  const filteredPatients = activeTab === 'urgentes'
    ? [...filteredBySearch].sort((a, b) => {
        // Ordena por data menos recente (mais antigas primeiro)
        return parseDate(a.lastEmergency).getTime() - parseDate(b.lastEmergency).getTime();
      })
    : filteredBySearch;

  const handleNavigation = (itemId: string) => {
    console.log(`Navigated to ${itemId}`);
    // Handle navigation logic here
    if (itemId === 'home') {
        window.location.href = '/acs-main-page';
    }
    if (itemId === 'patients') {
        window.location.href = '/patients';
    }
  };

  // Função para lidar com o clique no paciente e navegar para a página individual
  const handlePatientClick = (patient: any) => {
    console.log(`Navegando para página do paciente: ${patient.name}`);
    // Redireciona para a página individual do paciente usando o ID
    window.location.href = `/patient/${patient.id}/emergency`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header with back button and title */}
      <header className="p-4">
        {/* Back button at the top */}
        <div className="mb-2">
          <button onClick={() => window.history.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Title centered below */}
        <div className="flex justify-center">
            <h1 className="font-bold" style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '34px' }}>Emergências</h1>
        </div>
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

      {/* Emergency patients list - usando a lista filtrada */}
      <div className="flex-1 px-4 overflow-auto">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <PatientButton
              key={index}
              variant="emergency"
              name={patient.name}
              age={patient.age || 0}  // Providing a default value of 0 when age is undefined
              lastConsult={patient.lastConsult}
              lastRegistry={patient.lastRegistry}
              lastEmergency={patient.lastEmergency}
              onClick={() => handlePatientClick(patient)}
            />
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">
            Nenhum paciente encontrado com este nome.
          </div>
        )}
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