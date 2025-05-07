import React from "react";
import Header from "@/components/ui/header";
import { FaTrash } from "react-icons/fa"; // FontAwesome trash icon for delete

interface Reminder {
  title: string;
  observation: string;
  time: string;
}

interface ViewReminderProps {
  reminder: Reminder;
  onDelete: () => void;
}

const ViewReminder: React.FC<ViewReminderProps> = ({ reminder, onDelete }) => {
  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="View Reminder" />

      {/* Reminder Details */}
      <div style={styles.reminderContainer}>
        <h2 style={styles.title}>{reminder.title}</h2>
        <p style={styles.observation}>
          <strong>Observation:</strong> {reminder.observation}
        </p>
        <p style={styles.time}>
          <strong>Time:</strong> {reminder.time}
        </p>
      </div>

      {/* Delete Button */}
      <button onClick={onDelete} style={styles.deleteButton}>
        <FaTrash style={styles.trashIcon} />
        Delete Reminder
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
  reminderContainer: {
    padding: "16px",
    borderRadius: "8px",
    backgroundColor: "#F9F9F9",
    marginBottom: "24px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  observation: {
    fontSize: "16px",
    marginBottom: "12px",
    color: "#555",
  },
  time: {
    fontSize: "16px",
    marginBottom: "12px",
    color: "#555",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#FF4D4D",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  trashIcon: {
    fontSize: "18px",
  },
};

export default ViewReminder;
