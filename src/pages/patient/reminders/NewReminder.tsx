import React, { useState } from "react";
import Header from "@/components/ui/header";
import { WheelPicker } from "@/components/forms/wheel-picker";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { DateField } from "@/components/forms/date_input";
import { Checkbox } from "@/components/forms/checkbox";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import LoadingOverlay from "@/components/ui/loading";

// Updated types
interface WeekdayRule {
  day: "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA";
  occurrence?: number;
}

interface RecurrenceRule {
  frequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "once";
  interval?: number;
  count?: number;
  until?: string;
  byDay?: WeekdayRule[];
  byMonthDay?: number[];
  byMonth?: number[];
}

interface ReminderPayload {
  title: string;
  subtitle?: string;
  recurrence: RecurrenceRule;
  startDate: string;
  endDate?: string;
  type: "consultation" | "medicine" | "custom";
  notes?: string;
  isChecked?: boolean;
  observation?: string;
}

// Day mapping for byDay property
const WEEKDAY_MAP: Record<string, "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA"> = {
  "Sunday": "SU",
  "Monday": "MO",
  "Tuesday": "TU",
  "Wednesday": "WE",
  "Thursday": "TH",
  "Friday": "FR",
  "Saturday": "SA"
};

// API request function
async function sendRequest(url: string, { arg }: { arg: ReminderPayload }) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  }).then((res) => {
    if (!res.ok) throw new Error("An error occurred while saving the reminder");
    return res.json();
  });
}

const NewReminder: React.FC = () => {
  const router = useRouter();
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("00");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<RecurrenceRule["frequency"]>("once");
  const [interval, setInterval] = useState<number>(1);
  const [weekdayChecks, setWeekdayChecks] = useState<Record<string, boolean>>({
    "Sunday": false,
    "Monday": false,
    "Tuesday": false,
    "Wednesday": false,
    "Thursday": false,
    "Friday": false,
    "Saturday": false,
  });
  const [observation, setObservation] = useState("");

  // Initialize SWR mutation hook
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/reminders",
    sendRequest
  );

  const handleDateChange = (formattedValue: string) => {
    setSelectedDate(formattedValue);
  };

  const handleCheckboxChange = (day: string) => {
    setWeekdayChecks((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build byDay array for weekly recurrence
    const byDay: WeekdayRule[] = [];
    if (frequency === "weekly") {
      Object.entries(weekdayChecks).forEach(([day, checked]) => {
        if (checked) {
          byDay.push({ day: WEEKDAY_MAP[day] });
        }
      });
      
      // If no days selected but frequency is weekly, default to the current day
      if (byDay.length === 0) {
        const today = new Date().getDay();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayName = dayNames[today];
        byDay.push({ day: WEEKDAY_MAP[todayName] });
      }
    }

    // Create recurrence rule
    const recurrence: RecurrenceRule = {
      frequency,
      interval: frequency !== "once" ? interval : undefined,
    };
    
    // Add byDay if weekly frequency
    if (frequency === "weekly" && byDay.length > 0) {
      recurrence.byDay = byDay;
    }

    // Create reminder data
    const reminderData: ReminderPayload = {
      title,
      recurrence,
      startDate: selectedDate,
      time: `${selectedHour}:${selectedMinute}`, // Note: You'd need to adjust your backend to handle this
      type: "custom",
      observation,
    };

    try {
      await trigger(reminderData);
      router.push("/reminders");
    } catch (err) {
      toast.error("Failed to create reminder. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      {isMutating && <LoadingOverlay />}

      <form onSubmit={handleSubmit} style={styles.page}>
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
              <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                height: "100%",
                width: "100%",
                padding: "10px",
                borderRadius: "12px 0 0 12px",
                borderLeft: "2px solid #FA6E5A",
                borderTop: "2px solid #FA6E5A",
                borderBottom: "2px solid #FA6E5A",
              }}/>
            </WheelPicker>
            <span style={{ position: "absolute", top: "50%" }}>:</span>
            <WheelPicker
              data={minutes}
              selected={selectedMinute}
              onChange={(value: string) => setSelectedMinute(value)}
              height={150}
              width={80}
            >
              <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                height: "100%",
                width: "100%",
                padding: "10px",
                borderRadius: "0 12px 12px 0",
                borderRight: "2px solid #FA6E5A",
                borderTop: "2px solid #FA6E5A",
                borderBottom: "2px solid #FA6E5A",
              }}/>
            </WheelPicker>
          </div>
        </div>

        {/* Frequency Selection */}
        <div style={{ ...styles.section, ...styles.repeatToggleSection }}>
          <label className="block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1">
            Repetição:
          </label>
          <div style={styles.repeatToggleContainer}>
            {[
              {value: "once", label: "Once"},
              {value: "daily", label: "Daily"},
              {value: "weekly", label: "Weekly"},
              {value: "monthly", label: "Monthly"},
              {value: "yearly", label: "Yearly"}
            ].map((item, index, array) => (
              <React.Fragment key={item.value}>
                <button
                  type="button"
                  onClick={() => setFrequency(item.value as RecurrenceRule["frequency"])}
                  style={{
                    ...styles.repeatToggleButton,
                    backgroundColor: frequency === item.value ? "#DDFC8E" : "transparent",
                    color: "#141B36",
                    position: "relative",
                  }}
                >
                  {item.label}
                </button>
                {index < array.length - 1 && (
                  <span style={{
                    width: "1px",
                    height: "20px",
                    backgroundColor: "#141B36",
                    alignSelf: "center",
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Interval selector for recurrence (if not "once") */}
        {frequency !== "once" && (
          <div style={styles.section}>
            <label className="block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1">
              Intervalo de repetição:
            </label>
            <div style={styles.intervalContainer}>
              <input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                style={styles.intervalInput}
              />
              <span style={styles.intervalLabel}>
                {frequency === "daily" && "dia(s)"}
                {frequency === "weekly" && "semana(s)"}
                {frequency === "monthly" && "mês(es)"}
                {frequency === "yearly" && "ano(s)"}
              </span>
            </div>
          </div>
        )}

        {/* Weekday selection for weekly recurrence */}
        {frequency === "weekly" && (
          <div style={styles.section}>
            <label className="block text-sm font-['Inter'] font-light text-[#A0A3B1] mb-1">
              Dias da semana:
            </label>
            <div style={styles.checkboxContainer}>
              {Object.keys(weekdayChecks).map((day) => (
                <label key={day} style={styles.checkboxLabel}>
                  <Checkbox
                    checked={weekdayChecks[day]}
                    onCheckedChange={() => handleCheckboxChange(day)}
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
          disabled={isMutating}
        >
          {isMutating ? "ENVIANDO..." : "CONTINUAR"}
        </Button>
      </form>
    </>
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
    marginTop: "8px",
  },
  checkboxLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  wheelPickerContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#F9F9FF",
    padding: "12px",
    borderRadius: "24px",
    position: "relative",
  },
  weekday: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#141B36",
  },
  intervalContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
  },
  intervalInput: {
    width: "60px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #A0A3B1",
    marginRight: "8px",
  },
  intervalLabel: {
    fontSize: "14px",
    color: "#141B36",
  },
};

export default NewReminder;