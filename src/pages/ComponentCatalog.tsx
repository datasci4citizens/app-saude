import { Button } from "@/components/ui/button";
import { RadioCheckbox } from "@/components/ui/radio-checkbox";
import { useState } from "react";

export default function ComponentCatalog() {
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
    
      
      {/* Adicione mais seções para outros componentes aqui */}
    </div>
  );
}