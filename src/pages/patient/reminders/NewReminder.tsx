import React, { useState } from "react";
import Header from "@/components/ui/header";
import { WheelPicker } from "@/components/forms/wheel-picker";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { DateField } from "@/components/forms/date_input";
import { Checkbox } from "@/components/forms/checkbox";

const NewReminder: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  ); // 24-hour format
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [selectedDate, setSelectedDate] = useState<string>(""); // String format for DateField
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
    setSelectedDate(formattedValue); // Update date in string format
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
    <form onSubmit={handleSubmit} style={styles.page}>
      {/* Header */}
      <Header title="Configurar lembrete" />

      {/* Title Field */}
      <div style={styles.section}>
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
      <div style={styles.section}>
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
      <div style={styles.section}>
        <label className="block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1">
          Horário:
        </label>
        <div style={styles.wheelPickerContainer}>
          <WheelPicker
            data={hours}
            selected={selectedHour}
            onChange={(value: string) => setSelectedHour(value)}
            height={150}
            width={80}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                height: "100%",
                width: "100%",
                padding: "10px",
                borderRadius: "12px 0 0 12px",
                borderLeft: "2px solid #FA6E5A",
                borderTop: "2px solid #FA6E5A",
                borderBottom: "2px solid #FA6E5A",
              }}
            />
          </WheelPicker>
          <span
            style={{
              position: "absolute",
              top: "50%",
            }}
          >
            :
          </span>
          <WheelPicker
            data={minutes}
            selected={selectedMinute}
            onChange={(value: string) => setSelectedMinute(value)}
            height={150}
            width={80}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                height: "100%",
                width: "100%",
                padding: "10px",
                borderRadius: "0 12px 12px 0",
                borderRight: "2px solid #FA6E5A",
                borderTop: "2px solid #FA6E5A",
                borderBottom: "2px solid #FA6E5A",
              }}
            />
          </WheelPicker>
        </div>
      </div>

      {/* Repeat Pattern */}
      <div style={{ ...styles.section, ...styles.repeatToggleSection }}>
        <label className="block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1">
          Repetição:
        </label>
        <div style={styles.repeatToggleContainer}>
          {["Hour", "Day", "Week", "Month", "Year"].map(
            (type, index, array) => (
              <React.Fragment key={type}>
                <button
                  type="button"
                  onClick={() =>
                    setRepeatType(
                      type as "Hour" | "Day" | "Week" | "Month" | "Year"
                    )
                  }
                  style={{
                    ...styles.repeatToggleButton,
                    backgroundColor:
                      repeatType === type ? "#DDFC8E" : "transparent",
                    color: "#141B36",
                    position: "relative",
                  }}
                >
                  {type}
                </button>
                {index < array.length - 1 && (
                  <span
                    style={{
                      width: "1px",
                      height: "20px",
                      backgroundColor: "#141B36",
                      alignSelf: "center",
                    }}
                  />
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Weekday Checkboxes (Conditional Rendering) */}
      {repeatType === "Week" && (
        <div style={styles.section}>
          <div style={styles.checkboxContainer}>
            {Object.keys(repeatDays).map((day) => (
              <label key={day} style={styles.checkboxLabel}>
                <Checkbox
                  checked={repeatDays[day as keyof typeof repeatDays]}
                  onCheckedChange={() =>
                    handleCheckboxChange(day as keyof typeof repeatDays)
                  }
                  color="#DDFC8E"
                  height="h-7"
                  width="w-7"
                  radius="rounded-md"
                >
                  <span style={styles.weekday}>{day[0]}</span>
                </Checkbox>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Observation Field */}
      <div style={styles.section}>
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
        className="w-full mt-4 font-['Inter'] font-bold"
      >
        CONTINUAR
      </Button>
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: "16px",
    backgroundColor: "#FFFFFF",
    minHeight: "100vh",
    fontFamily: '"Inter", sans-serif',
  },
  section: {
    marginBottom: "16px",
    position: "relative",
  },
  repeatToggleSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  repeatToggleContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: "24px",
    border: "1.5px solid #141B36",
    overflow: "hidden",
    height: "32px",
  },
  repeatToggleButton: {
    flex: 1,
    border: "none",
    outline: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
    padding: "0 8px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  wheelPickerContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#F9F9FF",
    padding: "12px",
    borderRadius: "24px",
  },
  weekday: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#141B36",
  },
};

export default NewReminder;
