import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import Card from "@/components/ui/reminder-card";
import useSWR from "swr";
import LoadingOverlay from "@/components/ui/loading";
import { toast } from "react-hot-toast";
import type { Reminder } from "@/lib/types/Reminder";

// Fetch function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("An error occurred while fetching reminders");
  }

  return response.json();
};

const Reminders: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date();

  // Use SWR to fetch reminders
  const {
    data: reminders,
    isLoading,
    mutate,
  } = useSWR<Reminder[]>("/api/reminders", fetcher, {
    onError: (err) => {
      toast.error("Failed to load reminders. Please try again.");
      console.error(err);
    },
    revalidateOnFocus: true,
  });

  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0] as string
  );

  const [consultationsSortOrder, setConsultationsSortOrder] = useState<
    "asc" | "desc"
  >("asc");
  const [medicinesSortOrder, setMedicinesSortOrder] = useState<"asc" | "desc">(
    "asc"
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

  const isDateInRecurrencePattern = (date: string, reminder: Reminder): boolean => {
    const startDate = new Date(reminder.startDate);
    const currentDate = new Date(date);

    // Check if the date is before the start date
    if (currentDate < startDate) return false;

    // Check if the date is after the end date (if specified)
    if (reminder.endDate) {
      const endDate = new Date(reminder.endDate);
      if (currentDate > endDate) return false;
    }

    const { frequency } = reminder.recurrence;
    const interval = reminder.recurrence.interval || 1;

    // Handle one-time reminders
    if (frequency === "once") {
      const reminderDate = startDate.toISOString().split("T")[0];
      return reminderDate === date;
    }

    // Handle daily recurrence
    if (frequency === "daily") {
      const dayDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return dayDiff % interval === 0;
    }

    // Handle weekly recurrence
    if (frequency === "weekly") {
      const weekDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      
      // Check if this is the right week based on interval
      if (weekDiff % interval !== 0) return false;
      
      // If byDay is specified, check if the current day matches one of the specified days
      if (reminder.recurrence.byDay && reminder.recurrence.byDay.length > 0) {
        const weekdays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        const currentDay = weekdays[currentDate.getDay()];
        return reminder.recurrence.byDay.some(day => day.day === currentDay);
      }
      
      // If no byDay, check if it's the same day of the week as the start date
      return currentDate.getDay() === startDate.getDay();
    }

    // Handle monthly recurrence
    if (frequency === "monthly") {
      const monthDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                      (currentDate.getMonth() - startDate.getMonth());
      
      // Check if this is the right month based on interval
      if (monthDiff % interval !== 0) return false;
      
      // Check if it's the same day of month as the start date
      return currentDate.getDate() === startDate.getDate();
    }

    // Handle yearly recurrence
    if (frequency === "yearly") {
      const yearDiff = currentDate.getFullYear() - startDate.getFullYear();
      
      // Check if this is the right year based on interval
      if (yearDiff % interval !== 0) return false;
      
      // Check if it's the same month and day as the start date
      return currentDate.getMonth() === startDate.getMonth() && 
             currentDate.getDate() === startDate.getDate();
    }

    if (frequency === "hourly") {
      const dayDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return dayDiff === 0; // Only show on the same day
    }

    return false;
  };

  // Function to handle checkbox changes and update reminder state
  const handleCheckboxChange = async (id: string, checked: boolean) => {
    try {
      // Optimistically update the UI
      mutate(
        reminders?.map((reminder) =>
          reminder.id === id ? { ...reminder, isChecked: checked } : reminder
        ),
        false
      );

      // Send the update to the server
      const response = await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isChecked: checked }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reminder status");
      }

      // Revalidate the data after successful update
      mutate();
    } catch (err) {
      toast.error("Failed to update reminder status. Please try again.");
      console.error(err);
      // Revalidate to get the correct state
      mutate();
    }
  };

  const sortRemindersByTime = (
    reminders: Reminder[],
    order: "asc" | "desc"
  ): Reminder[] => {
    return [...reminders].sort((a, b) => {
      // Extract hours and minutes from subtitle (assuming format: "Às HH:MM")
      const timeA = a.subtitle.split(" ")[1];
      const timeB = b.subtitle.split(" ")[1];

      const comparison = timeA!.localeCompare(timeB!);
      return order === "asc" ? comparison : -comparison;
    });
  };

  // Filter reminders by date and type
  const getFilteredReminders = (type: "consultation" | "medicine" | "custom") => {
    if (!reminders) return [];

    return sortRemindersByTime(
      reminders
        .filter((reminder) => reminder.type === type)
        .filter((reminder) => isDateInRecurrencePattern(selectedDate, reminder)),
      type === "consultation" ? consultationsSortOrder : medicinesSortOrder
    );
  };

  const relevantConsultations = getFilteredReminders("consultation");
  const relevantMedicines = getFilteredReminders("medicine");
  const relevantCustomReminders = getFilteredReminders("custom");

  // Format the header date
  const formatHeaderDate = () => {
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();

    if (
      selectedDateObj.getDate() === today.getDate() &&
      selectedDateObj.getMonth() === today.getMonth() &&
      selectedDateObj.getFullYear() === today.getFullYear()
    ) {
      return `Hoje, ${selectedDateObj.toLocaleDateString("pt-BR")}`;
    }

    return selectedDateObj.toLocaleDateString("pt-BR");
  };

  return (
    <div style={styles.page}>
      {/* Show loading overlay when fetching data */}
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <Header
        title={formatHeaderDate()}
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
          {relevantConsultations.map((reminder) => (
            <Card
              key={reminder.id}
              title={reminder.title}
              subtitle={reminder.subtitle}
              icon={reminder.icon}
              isChecked={reminder.isChecked || false}
              onCheckboxChange={(checked) =>
                handleCheckboxChange(reminder.id, checked)
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
          {relevantMedicines.map((reminder) => (
            <Card
              key={reminder.id}
              title={reminder.title}
              subtitle={reminder.subtitle}
              icon={reminder.icon}
              isChecked={reminder.isChecked || false}
              onCheckboxChange={(checked) =>
                handleCheckboxChange(reminder.id, checked)
              }
            />
          ))}
        </div>
      ) : null}
      
      {/* Custom Reminders Section */}
      {relevantCustomReminders.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Outros Lembretes</h2>
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
          {relevantCustomReminders.map((reminder) => (
            <Card
              key={reminder.id}
              title={reminder.title}
              subtitle={reminder.subtitle}
              icon={reminder.icon}
              isChecked={reminder.isChecked || false}
              onCheckboxChange={(checked) =>
                handleCheckboxChange(reminder.id, checked)
              }
            />
          ))}
        </div>
      )}

      {/* No Reminders for the Day */}
      {!isLoading &&
      relevantConsultations.length === 0 &&
      relevantMedicines.length === 0 &&
      relevantCustomReminders.length === 0 ? (
        <div style={styles.noReminders}>
          <p>Não há lembretes para este dia.</p>
        </div>
      ) : null}

      {/* Floating Action Button */}
      <button style={styles.fab} onClick={() => navigate("/new-reminder")}>
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