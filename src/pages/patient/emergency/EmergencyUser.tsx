import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { Button } from "@/components/forms/button";
import { TextField } from '@/components/ui/text_input_diary';
import axios from 'axios';
import { useAuth } from '@/contexts/auth-context';

export default function EmergencyScreen() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [freeText, setFreeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Buscar profissionais associados
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get('/api/providers', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProviders(response.data);
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };
    
    if (user) fetchProviders();
  }, [user]);

  // Manipular seleção de profissionais
  const handleProviderSelect = (providerId) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  // Enviar dados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/emergency-alerts', {
        providerIds: selectedProviders,
        message: freeText
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      navigate('/confirmation'); // Redirecionar após sucesso
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Back Arrow */}
      <div className="mb-6">
        <BackArrow />
      </div>

      <h1 className="font-bold text-[28px] ml-8" style={{ fontFamily: "'Work Sans', sans-serif", color: '#3F414E' }}>
        Emergência
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de profissionais */}
        <div className="space-y-2 ml-8">
          <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
            Quais profissionais você deseja alertar?
          </h3>
          <div className="flex flex-col gap-4">
            {providers.map(provider => (
              <RadioCheckbox
                key={provider.provider_id}
                id={`provider-${provider.provider_id}`}
                label={provider.social_name}
                checked={selectedProviders.includes(provider.provider_id)}
                onCheckedChange={() => handleProviderSelect(provider.provider_id)}
              />
            ))}
          </div>
        </div>

        {/* Campo de texto livre */}
        <div className="space-y-2 ml-8">
          <TextField
            size="large"
            multiline
            variant="static-orange"
            label="Mensagem"
            placeholder="Descreva sua emergência..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
          />
        </div>

        {/* Botão de envio */}
        <div className="px-8">
          <Button 
            variant="orange" 
            size="responsive"
            type="submit"
            disabled={isSubmitting || !selectedProviders.length}
          >
            {isSubmitting ? 'Enviando...' : 'ENVIAR ALERTA'}
          </Button>
        </div>
      </form>
    </div>
  );
}