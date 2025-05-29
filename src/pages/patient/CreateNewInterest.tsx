import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { InterestAreasService } from "@/api/services/InterestAreasService";
import type { InterestArea } from "@/api/models/InterestArea";
import type { InterestAreaTrigger } from "@/api/models/InterestAreaTrigger";
import { MultiSelectCustom } from "@/components/forms/multi_select_custom";
import { SelectOption } from "@/utils/conceptLoader";

interface Question {
  id: string;
  text: string;
}

export default function CreateNewInterest() {
  const navigate = useNavigate();
  
  // Interest name state
  const [interestName, setInterestName] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  
  // Questions management
  const [newQuestion, setNewQuestion] = useState("");
  const [questionError, setQuestionError] = useState<string | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Selected questions (to become triggers)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle interest name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInterestName(e.target.value);
    if (nameError) setNameError(undefined);
  };

  // Handle question input change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion(e.target.value);
    if (questionError) setQuestionError(undefined);
  };

  // Add a new question to the list
  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      setQuestionError("Digite uma pergunta");
      return;
    }

    const newQuestionObj = {
      id: Date.now().toString(), // Unique ID
      text: newQuestion.trim()
    };

    setQuestions(prev => [...prev, newQuestionObj]);
    setNewQuestion(""); // Clear input after adding
  };

  // Handle multi-select change
  const handleSelectedQuestionsChange = (selectedValues: string[]) => {
    setSelectedQuestions(selectedValues);
  };

  // Submit the new interest with selected questions as triggers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate interest name
    if (!interestName.trim()) {
      setNameError("Nome do interesse é obrigatório");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create triggers from selected questions
      const triggers: InterestAreaTrigger[] = selectedQuestions.map(questionId => {
        const questionObj = questions.find(q => q.id === questionId);
        return {
          observation_concept_id: 2000301, // Specific concept ID for custom triggers
          custom_trigger_name: questionObj?.text || "",
          value_as_string: questionObj?.text || ""
        };
      });

      // Create custom interest area
      const newInterestArea: InterestArea = {
        observation_concept_id: 2000201,
        custom_interest_name: interestName.trim(),
        value_as_string: interestName.trim(),
        triggers: triggers
      };

      await InterestAreasService.personInterestAreasCreate(newInterestArea);
      
      // Navigate back to main page on success
      navigate("/user-main-page");
    } catch (error) {
      console.error("Error creating custom interest:", error);
      setSubmitError("Erro ao criar interesse personalizado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/user-main-page");
  };

  // Convert questions to options format for MultiSelect
  const questionOptions: SelectOption[] = questions.map(q => ({
    value: q.id,
    label: q.text
  }));

  return (
    <div className="p-4 h-full bg-primary overflow-y-auto"
         style={{ height: "100vh" }}>
      
      
        {/* Header */}
        
          <Header
            title="Novo interesse"
            onBackClick={handleBack}
          />
        

      <div className="px-4 py-5 flex flex-col gap-6">
        {/* Error message */}
        {submitError && (
          <div className="p-3 bg-destructive bg-opacity-10 border border-destructive text-white rounded-md">
            <p>{submitError}</p>
          </div>
        )}

        {/* Interest Name */}
        <TextField
          id="interest-name"
          name="interest-name"
          label=""
          value={interestName}
          onChange={handleNameChange}
          placeholder="Nome do novo interesse"
          error={nameError}
        />

        {/* Selected Questions Section */}
        <div>
          <h3 className="text-sm font-medium text-typography mb-2">Perguntas selecionadas</h3>
          
          <MultiSelectCustom
            id="selected-questions"
            name="selected-questions"
            options={questionOptions}
            value={selectedQuestions}
            onChange={handleSelectedQuestionsChange}
            placeholder="Selecione perguntas"
            isLoading={false}
          />
        </div>

        {/* Add New Question Section */}
        <div className="mt-2">
          <h3 className="text-sm font-medium text-typography mb-2">Criar nova pergunta</h3>
          
          <TextField
            id="new-question"
            name="new-question"
            label=""
            value={newQuestion}
            onChange={handleQuestionChange}
            placeholder="Nova pergunta"
            error={questionError}
          />
          
          {/* Add Question Button */}
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleAddQuestion}
              className="bg-primary border border-2 border-selection hover:bg-primary/90 text-typography font-bold py-3 px-6 uppercase"
              type="button"
            >
              Adicionar pergunta
            </Button>
          </div>
        </div>

        {/* Create Interest Button - Fixed at bottom */}
        <div className="fixed bottom-8 left-0 right-0 px-4">
          <Button
            onClick={handleSubmit}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 font-bold"
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? "CRIANDO..." : "CRIAR NOVO INTERESSE"}
          </Button>
        </div>
      </div>
    </div>
  );
}