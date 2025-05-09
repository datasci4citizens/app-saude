import React from "react";
import Header from "@/components/ui/header";
import { FaTrash } from "react-icons/fa";
import type { Reminder, RecurrenceRule } from "@/lib/types/Reminder";

interface ViewReminderProps {
  reminder: Reminder;
  onDelete: () => void;
}

const ViewReminder: React.FC<ViewReminderProps> = ({ reminder, onDelete }) => {
  const formatRecurrenceRule = (rule: RecurrenceRule): string => {
    let description = "";

    switch (rule.frequency) {
      case "once":
        return "One-time";
        
      case "hourly":
        description = `Every ${rule.interval || 1} hour${(rule.interval || 1) > 1 ? 's' : ''}`;
        break;
        
      case "daily":
        description = `Every ${rule.interval || 1} day${(rule.interval || 1) > 1 ? 's' : ''}`;
        break;
        
      case "weekly":
        description = `Every ${rule.interval || 1} week${(rule.interval || 1) > 1 ? 's' : ''}`;
        if (rule.byDay && rule.byDay.length > 0) {
          const dayNames = {
            SU: "Sunday",
            MO: "Monday",
            TU: "Tuesday",
            WE: "Wednesday",
            TH: "Thursday",
            FR: "Friday",
            SA: "Saturday"
          };
          const days = rule.byDay.map(d => dayNames[d.day]).join(", ");
          description += ` on ${days}`;
        }
        break;
        
      case "monthly":
        description = `Every ${rule.interval || 1} month${(rule.interval || 1) > 1 ? 's' : ''}`;
        break;
        
      case "yearly":
        description = `Every ${rule.interval || 1} year${(rule.interval || 1) > 1 ? 's' : ''}`;
        break;
        
      default:
        description = "Custom recurrence";
    }

    return description;
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="View Reminder" />

      {/* Reminder Details */}
      <div style={styles.reminderContainer}>
        <h2 style={styles.title}>{reminder.title}</h2>
        <p style={styles.subtitle}>{reminder.subtitle}</p>
        
        <div style={styles.detailRow}>
          <strong>Type:</strong> {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}
        </div>
        
        <div style={styles.detailRow}>
          <strong>Start Date:</strong> {new Date(reminder.startDate).toLocaleDateString()}
        </div>
        
        {reminder.endDate && (
          <div style={styles.detailRow}>
            <strong>End Date:</strong> {new Date(reminder.endDate).toLocaleDateString()}
          </div>
        )}
        
        <div style={styles.detailRow}>
          <strong>Recurrence:</strong> {formatRecurrenceRule(reminder.recurrence)}
        </div>
        
        {reminder.observation && (
          <div style={styles.detailRow}>
            <strong>Observation:</strong> {reminder.observation}
          </div>
        )}
        
        {reminder.isChecked !== undefined && (
          <div style={styles.detailRow}>
            <strong>Status:</strong> {reminder.isChecked ? "Completed" : "Pending"}
          </div>
        )}
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
  subtitle: {
    fontSize: "18px",
    marginBottom: "16px",
    color: "#555",
  },
  detailRow: {
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