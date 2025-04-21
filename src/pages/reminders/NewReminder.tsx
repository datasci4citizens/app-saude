import React, { useState } from "react";
import Header from "../../components/header";

const NewReminder: React.FC = () => {
  const [time, setTime] = useState("12:00");
  const [startDate, setStartDate] = useState("");
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

  const handleCheckboxChange = (day: keyof typeof repeatDays) => {
    setRepeatDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleCreateReminder = () => {
    const reminderData = {
      time,
      startDate,
      repeatDays,
      observation,
    };
    console.log(reminderData);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header
        title="Hoje, dia 19/04"
      />

      {/* Time Picker */}
      <div style={styles.section}>
        <label style={styles.label}>Time:</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Start Date */}
      <div style={styles.section}>
        <label style={styles.label}>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Repeat Days */}
      <div style={styles.section}>
        <label style={styles.label}>Repeat:</label>
        <div style={styles.checkboxContainer}>
          {Object.keys(repeatDays).map((day) => (
            <label key={day} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={repeatDays[day as keyof typeof repeatDays]}
                onChange={() => handleCheckboxChange(day as keyof typeof repeatDays)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      {/* Observation Field */}
      <div style={styles.section}>
        <label style={styles.label}>Observation:</label>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          style={styles.textarea}
          placeholder="Add any notes or observations..."
        />
      </div>

      {/* Create Reminder Button */}
      <button onClick={handleCreateReminder} style={styles.button}>
        Create Reminder
      </button>
    </div>
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
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "8px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  checkboxContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default NewReminder;