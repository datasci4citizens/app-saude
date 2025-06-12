import React from "react";
import Header from "@/components/ui/header";
import { FaTrash } from "react-icons/fa"; // FontAwesome trash icon for delete
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useNavigate, useLocation } from "react-router-dom";

interface Emergency {
  title: string;
  observation: string;
  time: string;
}

interface ViewEmergencyProps {
  emergency: Emergency;
}
const navigate = useNavigate();
const location = useLocation();
const getActiveNavId = () => {
  if (location.pathname.startsWith("/acs-main-page")) return "home";
  if (location.pathname.startsWith("/appointments")) return "consults";
  if (location.pathname.startsWith("/patients")) return "patients";
  if (location.pathname.startsWith("/emergencies")) return "emergency";
  if (location.pathname.startsWith("/acs-profile")) return "profile";
  return null;
};
const handleNavigationClick = (itemId: string) => {
  switch (itemId) {
    case "home":
      navigate("/acs-main-page");
      break;
    case "patients":
      navigate("/patients");
      break;
    case "emergency":
      navigate("/emergencies");
      break;
    case "profile":
      navigate("/acs-profile");
      break;
  }
};

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
      <BottomNavigationBar
        variant="acs"
        forceActiveId={getActiveNavId()} // Controlled active state
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

export default ViewReminder;
