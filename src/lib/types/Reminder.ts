// Updated Reminder interface
export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  recurrence: RecurrenceRule;
  startDate: string;
  endDate?: string;
  type: "consultation" | "medicine" | "custom";
  isChecked?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  observation?: string;
}

// Industry standard inspired recurrence rule
export interface RecurrenceRule {
  frequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "once";
  interval?: number; // How many units of frequency to skip between occurrences
  count?: number; // Maximum number of occurrences
  until?: string; // End date (ISO format)
  byDay?: WeekdayRule[]; // For weekly, which days
  byMonthDay?: number[]; // For monthly, which days of month
  byMonth?: number[]; // For yearly, which months
}

export interface WeekdayRule {
  day: "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA";
  occurrence?: number; // For nth occurrence (-1 for last)
}
