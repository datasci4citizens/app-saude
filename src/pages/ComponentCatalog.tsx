import { Button } from "@/components/ui/button";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import PatientsPage from "@/components/ui/patient-button";

export default function ComponentCatalog() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
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
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Task Bar</h2>
        <div className='flex flex-wrap justify-center'>
            <BottomNavigationBar variant="user"/>
            {/* não é possível colocar as duas devido a ficarem fixas na parte de baixo da página */}
        </div>

      </section>
    
      
      {/* Adicione mais seções para outros componentes aqui */}
    </div>
  );
}