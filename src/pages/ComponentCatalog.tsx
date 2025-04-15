import { Button } from "@/components/ui/button";

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
        <div className='flex flex-wrap justify-center'>
          <span className="mgc_search_line"></span>
          <span className="mgc_search_fill"></span>
        </div>
      </section>
    
      
      {/* Adicione mais seções para outros componentes aqui */}
    </div>
  );
}