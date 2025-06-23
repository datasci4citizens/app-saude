import type React from "react";
import Header from "@/components/ui/header";
import { FaTrash } from "react-icons/fa";

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
    <div className="p-4 bg-primary min-h-screen font-inter">
      {/* Header */}
      <Header title="Visualizar Lembrete" />

      {/* Reminder Details */}
      <div className="p-4 rounded-lg bg-offwhite mb-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-3 text-typography">
          {reminder.title}
        </h2>
        <p className="text-base mb-3 text-typography">
          <strong>Observação:</strong> {reminder.observation}
        </p>
        <p className="text-base mb-3 text-typography">
          <strong>Horário:</strong> {reminder.time}
        </p>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex items-center justify-center gap-2 w-full py-3 text-base font-bold text-primary bg-selection border-none rounded cursor-pointer"
      >
        <FaTrash className="text-lg text-typography" />
        Excluir Lembrete
      </button>
    </div>
  );
};

export default ViewReminder;
