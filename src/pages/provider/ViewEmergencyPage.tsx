import React from "react";
import Header from "@/components/ui/header";
import { FaTrash } from "react-icons/fa"; // FontAwesome trash icon for delete

interface Emergency {
  title: string;
  observation: string;
  time: string;
}

interface ViewEmergencyProps {
  emergency: Emergency;
}

const ViewReminder: React.FC<ViewEmergencyProps> = ({ emergency }) => {
  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="Ver pedidos de ajuda" />

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

export default ViewReminder;
