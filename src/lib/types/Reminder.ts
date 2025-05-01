// Updated Reminder interface
export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  recurrence: RecurrenceRule;
  startDate: string;
  endDate?: string;
  type: "consultation" | "medicine";
  isChecked?: boolean;
  observation?: string;
}

export interface RecurrenceRule {
  frequency: "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "once";
  interval?: number;
  byDay?: WeekdayRule[];
}

export interface WeekdayRule {
  day: "SU" | "MO" | "TU" | "WE" | "TH" | "FR" | "SA";
  occurrence?: number;
}
