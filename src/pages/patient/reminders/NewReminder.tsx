import React, { useState } from "react";
import Header from "@/components/ui/header";
import { WheelPicker } from "@/components/forms/wheel-picker";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { DateField } from "@/components/forms/date_input";
import { Checkbox } from "@/components/forms/checkbox";

const NewReminder: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  ); // 24-hour format
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("00");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [title, setTitle] = useState("");
  const [repeatType, setRepeatType] = useState<
    "Hour" | "Day" | "Week" | "Month" | "Year"
  >("Week");
  const [repeatDays, setRepeatDays] = useState<{
    Sunday: boolean;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
  }>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const [observation, setObservation] = useState("");

  const handleDateChange = (formattedValue: string) => {
    setSelectedDate(formattedValue);
  };

  const handleCheckboxChange = (day: keyof typeof repeatDays) => {
    setRepeatDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reminderData = {
      date: selectedDate,
      time: `${selectedHour}:${selectedMinute}`,
      title,
      repeatType,
      repeatDays,
      observation,
    };
    console.log(reminderData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-primary min-h-screen font-inter"
    >
      {/* Header */}
      <Header title="Configurar lembrete" />

      {/* Title Field */}
      <div className="mb-4 relative">
        <TextField
          id="title"
          name="title"
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do lembrete"
          helperText="Exemplo: Tomar remédio ou consulta médica"
        />
      </div>

      {/* Date Field */}
      <div className="mb-4 relative">
        <DateField
          id="date"
          name="date"
          label="Data"
          value={selectedDate}
          onChange={handleDateChange}
          placeholder="dd/mm/aaaa"
        />
      </div>

      {/* Time Picker */}
      <div className="mb-4 relative">
        <label className="block text-sm font-inter font-light text-gray2 mb-1">
          Horário:
        </label>
        <div className="flex justify-center w-full bg-offwhite p-3 rounded-3xl">
          <WheelPicker
            data={hours}
            selected={selectedHour}
            onChange={(value: string) => setSelectedHour(value)}
            height={150}
            width={80}
          >
            <div className="bg-black bg-opacity-5 h-full w-full p-2.5 rounded-l-xl border-l-2 border-t-2 border-b-2 border-selection" />
          </WheelPicker>
          <span className="absolute top-1/2">:</span>
          <WheelPicker
            data={minutes}
            selected={selectedMinute}
            onChange={(value: string) => setSelectedMinute(value)}
            height={150}
            width={80}
          >
            <div className="bg-black bg-opacity-5 h-full w-full p-2.5 rounded-r-xl border-r-2 border-t-2 border-b-2 border-selection" />
          </WheelPicker>
        </div>
      </div>

      {/* Repeat Pattern */}
      <div className="mb-4 relative flex flex-col w-full">
        <label className="block text-sm font-inter font-light text-gray2 mb-1">
          Repetição:
        </label>
        <div className="flex justify-between w-full rounded-3xl border-1.5 border-typography overflow-hidden h-8">
          {["Hour", "Day", "Week", "Month", "Year"].map(
            (type, index, array) => (
              <React.Fragment key={type}>
                <button
                  type="button"
                  onClick={() =>
                    setRepeatType(
                      type as "Hour" | "Day" | "Week" | "Month" | "Year",
                    )
                  }
                  className={`flex-1 border-none outline-none cursor-pointer text-xs font-medium transition-colors duration-300 p-0 px-2 h-full flex items-center justify-center text-typography relative ${
                    repeatType === type ? "bg-selected" : "bg-transparent"
                  }`}
                >
                  {type}
                </button>
                {index < array.length - 1 && (
                  <span className="w-px h-5 bg-typography self-center" />
                )}
              </React.Fragment>
            ),
          )}
        </div>
      </div>

      {/* Weekday Checkboxes (Conditional Rendering) */}
      {repeatType === "Week" && (
        <div className="mb-4 relative">
          <div className="flex justify-between">
            {Object.keys(repeatDays).map((day) => (
              <label key={day} className="cursor-pointer">
                <Checkbox
                  checked={repeatDays[day as keyof typeof repeatDays]}
                  onCheckedChange={() =>
                    handleCheckboxChange(day as keyof typeof repeatDays)
                  }
                  height="h-7"
                  width="w-7"
                  radius="rounded-md"
                >
                  <span className="text-xs font-medium text-typography">
                    {day[0]}
                  </span>
                </Checkbox>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Observation Field */}
      <div className="mb-4 relative">
        <TextField
          id="observation"
          name="observation"
          label="Observação"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Adicione quaisquer anotações ou observações..."
          helperText="Informações adicionais sobre o lembrete"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="orange"
        className="w-full mt-4 font-inter font-bold"
      >
        CONTINUAR
      </Button>
    </form>
  );
};

export default NewReminder;
