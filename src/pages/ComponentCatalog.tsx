import { Button } from "@/components/ui/button";
import BottomNavigationBar from "@/components/ui/navigator-bar";

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

  return (
    <div className="p-6 max-w-4xl mx-auto mx-auto overflow-y-auto" style={{height: '100vh'}}>
      <h1 className="text-3xl font-bold mb-8">Catálogo de Componentes UI</h1>

      {/* Seção de Botões */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Botões</h2>

        <h3 className="text-lg font-medium mt-4 mb-2">Variantes</h3>
        <div className="flex flex-wrap justify-center">
          <Button variant="orange" size="responsive" position="bottom">
            orange
          </Button>
          <Button variant="white" size="responsive" position="bottom">
            white
          </Button>
        </div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Task Bar</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">Variantes</h3>
        <div className='flex flex-wrap justify-center'>
            <BottomNavigationBar />
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
  <div className='flex justify-center mb-4'>
    <div className='w-full max-w-md'>
      <LabeledSwitch 
        label="Compartilhar esses dados com profissionais de saúde"
        checked={labeledToggleState}
        onCheckedChange={setLabeledToggleState}
      />
    </div>
  </div>
</section>
      
      {/* Adicione mais seções para outros componentes aqui */}
    </div>
  );
}
