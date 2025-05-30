import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import Card from "@/components/ui/reminder-card";

interface Reminder {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  repeatPattern: "daily" | "weekly";
  startDate: string;
  endDate?: string;
}

const Reminders: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();

  const consultations: Reminder[] = [
    {
      title: "Consulta com psiquiatra",
      subtitle: "Às 13:45",
      icon: <span className="mgc-user-line text-typography" />,
      repeatPattern: "weekly",
      startDate: "2023-04-19",
    },
  ];

  const medicines: Reminder[] = [
    {
      title: "Pimozida",
      subtitle: "Às 11:00",
      icon: <span className="mgc-pill-line text-typography" />,
      repeatPattern: "daily",
      startDate: "2023-04-22",
    },
    {
      title: "Sertralina",
      subtitle: "Às 11:00",
      icon: <span className="mgc-pill-line text-typography" />,
      repeatPattern: "daily",
      startDate: "2023-04-22",
      endDate: "2023-04-28",
    },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0] as string,
  );

  const [consultationsSortOrder, setConsultationsSortOrder] = useState<
    "asc" | "desc"
  >("asc");
  const [medicinesSortOrder, setMedicinesSortOrder] = useState<"asc" | "desc">(
    "asc",
  );

  // Generate 20 days from today for the date slider
  const dates = Array.from({ length: 20 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      iso: date.toISOString().split("T")[0],
      display: `${date
        .toLocaleString("default", { month: "short" })
        .toUpperCase()} ${date.getDate()}`,
    };
  });

  const isDateInRepeatPattern = (date: string, reminder: Reminder): boolean => {
    const startDate = new Date(reminder.startDate);
    const currentDate = new Date(date);

    if (reminder.endDate) {
      const endDate = new Date(reminder.endDate);
      if (currentDate > endDate) return false;
    }

    if (reminder.repeatPattern === "daily") {
      return currentDate >= startDate;
    } else if (reminder.repeatPattern === "weekly") {
      return (
        currentDate >= startDate && currentDate.getDay() === startDate.getDay()
      );
    }

    return false;
  };

  const sortRemindersByTime = (
    reminders: Reminder[],
    order: "asc" | "desc",
  ): Reminder[] => {
    return [...reminders].sort((a, b) => {
      return 0;
    });
  };

  const relevantConsultations = sortRemindersByTime(
    consultations.filter((reminder) =>
      isDateInRepeatPattern(selectedDate, reminder),
    ),
    consultationsSortOrder,
  );

  const relevantMedicines = sortRemindersByTime(
    medicines.filter((reminder) =>
      isDateInRepeatPattern(selectedDate, reminder),
    ),
    medicinesSortOrder,
  );

  return (
    <div className="p-4 bg-primary min-h-screen font-inter relative">
      {/* Header */}
      <Header
        title="Hoje, dia 19/04"
        rightIcon={
          <span className="mgc-pencil-line text-lg text-typography cursor-pointer" />
        }
      />

      {/* Horizontal Scrollable Date List */}
      <div className="flex overflow-x-auto gap-4 my-4 py-2">
        {dates.map((date) => (
          <div
            key={date.iso}
            className={`flex-shrink-0 w-[54px] h-[80px] rounded-3xl flex items-center justify-center cursor-pointer text-center ${
              date.iso === selectedDate ? "bg-selection" : "bg-offwhite"
            }`}
            onClick={() => setSelectedDate(date.iso as string)}
          >
            <div>
              <h5 className="text-base font-bold text-typography">
                {date.display.split(" ")[1]}
              </h5>
              <h6 className="text-xs font-normal text-typography">
                {new Date(date.iso as string).toLocaleDateString("pt-BR", {
                  weekday: "short",
                })}
              </h6>
            </div>
          </div>
        ))}
      </div>

      {/* Consultations Section */}
      {relevantConsultations.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold m-0 text-typography">
              Consultas
            </h2>
            <span
              className="mgc-sort-line text-lg text-typography cursor-pointer ml-2"
              onClick={() =>
                setConsultationsSortOrder(
                  consultationsSortOrder === "asc" ? "desc" : "asc",
                )
              }
            />
          </div>
          <hr className="border-none border-t border-gray2 border-opacity-20 mb-3" />
          {relevantConsultations.map((reminder, index) => (
            <Card
              key={index}
              title={reminder.title}
              subtitle={reminder.subtitle}
              icon={reminder.icon}
              isChecked={true}
              onCheckboxChange={(checked) =>
                console.log(`${reminder.title} checkbox:`, checked)
              }
            />
          ))}
        </div>
      ) : null}

      {/* Medicines Section */}
      {relevantMedicines.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold m-0 text-typography">
              Medicamentos
            </h2>
            <span
              className="mgc-sort-line text-lg text-typography cursor-pointer ml-2"
              onClick={() =>
                setMedicinesSortOrder(
                  medicinesSortOrder === "asc" ? "desc" : "asc",
                )
              }
            />
          </div>
          <hr className="border-none border-t border-gray2 border-opacity-20 mb-3" />
          {relevantMedicines.map((reminder, index) => (
            <Card
              key={index}
              title={reminder.title}
              subtitle={reminder.subtitle}
              icon={reminder.icon}
              isChecked={true}
              onCheckboxChange={(checked) =>
                console.log(`${reminder.title} checkbox:`, checked)
              }
            />
          ))}
        </div>
      ) : null}

      {/* No Reminders for the Day */}
      {relevantConsultations.length === 0 && relevantMedicines.length === 0 ? (
        <div className="mt-6 text-center text-gray2 text-base">
          <p>Não há lembretes para este dia.</p>
        </div>
      ) : null}

      {/* Floating Action Button - mudando o ícone para usar text-typography */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-selection flex items-center justify-center shadow-md border-none cursor-pointer"
        onClick={() => navigate("/new-reminder")}
      >
        <span className="mgc_add_line text-2xl text-typography" />
      </button>
    </div>
  );
};

export default Reminders;
