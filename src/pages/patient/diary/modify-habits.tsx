import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/forms/button";
import {
  SelectField
  //SelectTrigger,
  //SelectContent,
  //SelectItem,
  //SelectValue,
} from "@/components/forms/select_input";
import { TextField } from "@/components/forms/text_input";
import Header from "@/components/ui/header";

const ModifyHabits = () => {
  const navigate = useNavigate();
  const [habitName, setHabitName] = useState("");
  const [measurementType, setMeasurementType] = useState<
    "scale" | "hours" | "times" | "yesno"
  >("scale");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(-1, {
      state: {
        newHabit: {
          id: Date.now().toString(),
          name: habitName,
          measurementType,
        },
      },
    });
  };

  // Define measurement type options
  const measurementTypeOptions = [
    { value: "scale", label: "Escala (1-10)" },
    { value: "hours", label: "Horas" },
    { value: "times", label: "Vezes" },
    { value: "yesno", label: "Sim/Não" }
  ];

  // Handle change from SelectField
  const handleMeasurementTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMeasurementType(e.target.value as "scale" | "hours" | "times" | "yesno");
  };

  return (
    <div className="max-w-md mx-auto p-4">
     
       {/* header */}
      <Header 
        title="Criar Novo Hábito" 
        onBackClick={() => navigate(-1)} 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Criar Novo Hábito</h2>

        <TextField
          label="Nome do Hábito"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          required
        />

        <SelectField
          id="measurementType"
          name="measurementType"
          label="Tipo de Medição"
          value={measurementType}
          options={measurementTypeOptions}
          onChange={handleMeasurementTypeChange}
          isLoading={false}
          placeholder="Selecione o tipo"
        />
        <Button variant="orange" type="submit" className="w-full text-offwhite">
          Criar Hábito
        </Button>
      </form>
    </div>
  );
};

export default ModifyHabits;
