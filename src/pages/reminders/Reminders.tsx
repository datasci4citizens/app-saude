import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import Header from "../../components/ui/header";
import Card from "../../components/reminder-card";

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
      icon: <span className="mgc-user-line" />,
      repeatPattern: "weekly",
      startDate: "2023-04-19",
    },
  ];

  const medicines: Reminder[] = [
    {
      title: "Pimozida",
      subtitle: "Às 11:00",
      icon: <span className="mgc-pill-line" />,
      repeatPattern: "daily",
      startDate: "2023-04-22",
    },
    {
      title: "Sertralina",
      subtitle: "Às 11:00",
      icon: <span className="mgc-pill-line" />,
      repeatPattern: "daily",
      startDate: "2023-04-22",
      endDate: "2023-04-28",
    },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );

  const [consultationsSortOrder, setConsultationsSortOrder] = useState<
    "asc" | "desc"
  >("asc");
  const [medicinesSortOrder, setMedicinesSortOrder] =
    useState<"asc" | "desc">("asc");

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
    order: "asc" | "desc"
  ): Reminder[] => {
    return [...reminders].sort((a, b) => {
      return 0;
    });
  };

  const relevantConsultations = sortRemindersByTime(
    consultations.filter((reminder) =>
      isDateInRepeatPattern(selectedDate, reminder)
    ),
    consultationsSortOrder
  );

  const relevantMedicines = sortRemindersByTime(
    medicines.filter((reminder) =>
      isDateInRepeatPattern(selectedDate, reminder)
    ),
    medicinesSortOrder
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header
        title="Hoje, dia 19/04"
        rightIcon={<span style={styles.editIcon} className="mgc-pencil-line" />}
      />

      {/* Horizontal Scrollable Date List */}
      <div style={styles.dateListContainer}>
        {dates.map((date) => (
          <div
            key={date.iso}
            style={{
              ...styles.dateBox,
              backgroundColor:
                date.iso === selectedDate ? "#FA6E5A" : "#F9F9FF",
            }}
            onClick={() => setSelectedDate(date.iso as string)}
          >
            <div>
              <h5 style={styles.dateNumber}>{date.display.split(" ")[1]}</h5>
              <h6 style={styles.weekday}>
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
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Consultas</h2>
            <span
              style={styles.sortIcon}
              className="mgc-sort-line"
              onClick={() =>
                setConsultationsSortOrder(
                  consultationsSortOrder === "asc" ? "desc" : "asc"
                )
              }
            />
          </div>
          <hr style={styles.divider} />
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
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Medicamentos</h2>
            <span
              style={styles.sortIcon}
              className="mgc-sort-line"
              onClick={() =>
                setMedicinesSortOrder(
                  medicinesSortOrder === "asc" ? "desc" : "asc"
                )
              }
            />
          </div>
          <hr style={styles.divider} />
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
        <div style={styles.noReminders}>
          <p>Não há lembretes para este dia.</p>
        </div>
      ) : null}

      {/* Floating Action Button */}
      <button
        style={styles.fab}
        onClick={() => navigate("/new-reminder")}
      >
        <span className="mgc_add_line" style={styles.fabIcon} />
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
    position: "relative",
  },
  editIcon: {
    fontSize: "18px",
    color: "#6A5ACD",
    cursor: "pointer",
  },
  sortIcon: {
    fontSize: "18px",
    color: "#6A5ACD",
    cursor: "pointer",
    marginLeft: "8px",
  },
  dateListContainer: {
    display: "flex",
    overflowX: "scroll",
    gap: "16px",
    margin: "16px 0",
    padding: "8px 0",
  },
  dateBox: {
    flexShrink: 0,
    width: "54px",
    height: "80px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
  },
  dateNumber: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#141B36",
  },
  weekday: {
    fontSize: "12px",
    fontWeight: "normal",
    color: "#141B36",
  },
  section: {
    marginTop: "24px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
    color: "#141B36",
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(173, 184, 217, 0.2)",
    marginBottom: "12px",
  },
  noReminders: {
    marginTop: "24px",
    textAlign: "center",
    color: "#999",
    fontSize: "16px",
  },
  fab: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#FA6E5A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    border: "none",
    cursor: "pointer",
  },
  fabIcon: {
    fontSize: "24px",
    color: "#FFFFFF",
  },
};

export default Reminders;