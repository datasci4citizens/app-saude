import { useState } from 'react';
import { TextField } from '@/components/forms/text_input';
import PatientButton from '@/components/ui/patient-button';
import BottomNavigationBar from '@/components/ui/navigator-bar';

export default function PatientsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  
  // Sample data for patients
  const patients = [
    {
      id: 'claudia123',
      name: 'Cláudia Fernandes',
      age: 18,
      lastConsult: '31/03/2024',
      lastRegistry: '28/04/2025',
      lastEmergency: '',
    },
    {
      id: 'fernanda456',
      name: 'Fernanda Ribeiro',
      age: 22,
      lastConsult: '31/03/2024',
      lastRegistry: '29/04/2025',
      lastEmergency: '01/01/2024',
      highlight: true, // Usado para destacar o cartão em azul
    },
    {
      id: 'jose789',
      name: 'José Silva',
      age: 66,
      lastConsult: '25/03/2024',
      lastRegistry: '26/04/2025',
      lastEmergency: '01/01/2024',
    },
    {
      id: 'amanda101',
      name: 'Amanda de Souza',
      age: 30,
      lastConsult: '25/03/2024',
      lastRegistry: '25/04/2024',
      lastEmergency: '01/01/2024',
      urgent: true, // Usado para destacar o cartão em laranja
    }
  ];

  // Função auxiliar para converter data DD/MM/AAAA para objeto Date
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date(0); // Data mínima se estiver vazio
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Filtra pacientes com base na busca
  const filteredBySearch = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  // Aplica ordenação por urgência se estiver na aba urgentes
  const filteredPatients = activeTab === 'urgentes'
    ? filteredBySearch.filter(patient => patient.urgent)
    : filteredBySearch;

  const handleNavigation = (itemId: string) => {
    console.log(`Navigated to ${itemId}`);
    if (itemId === 'home') {
        window.location.href = '/acs-main-page';
    }
    if (itemId === 'emergency') {
        window.location.href = '/emergencies';
    }
  };

  // Função para lidar com o clique no paciente e navegar para a página individual
  const handlePatientClick = (patient: any) => {
    console.log(`Navegando para página do paciente: ${patient.name}`);
    window.location.href = `/patient/${patient.id}`;
  };

  // Determina a variante do botão do paciente baseado nos atributos
  const getPatientVariant = (patient: any) => {
    if (patient.urgent) return 'emergency';
    // Não usa highlighted porque não é uma variante suportada
    return 'patient';
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
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
            <h1 className="font-bold" style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '34px' }}>Painel de pacientes</h1>
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

      {/* Patients list */}
      <div className="flex-1 px-4 overflow-auto">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <PatientButton
              key={index}
              variant={getPatientVariant(patient)}
              name={patient.name}
              age={patient.age || 0}
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
        initialActiveId="patients" 
        onItemClick={handleNavigation}
      />
    </div>
  );
}