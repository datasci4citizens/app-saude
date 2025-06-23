type HabitMeasurementType = "scale" | "hours" | "times" | "yesno";
type HabitFrequency = "daily" | "weekly" | "monthly";

interface Habit {
  id: string;
  name: string;
  measurementType: HabitMeasurementType;
  frequency: HabitFrequency;
  shared: boolean;
  value?: number | boolean;
}

interface HabitEntryProps {
  habit: Habit;
  onChange: (updated: Habit) => void;
  onRemove?: () => void;
}

export default function HabitEntry({
  habit,
  onChange,
  onRemove,
}: HabitEntryProps) {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      {/* Habit Name */}
      <input
        type="text"
        value={habit.name}
        onChange={(e) => onChange({ ...habit, name: e.target.value })}
        placeholder="Habit name"
        className="w-full p-2 border-b"
        disabled={!onRemove} // Disable for general questions
      />

      {/* Measurement Type */}
      <div className="flex space-x-4">
        <select
          value={habit.measurementType}
          onChange={(e) =>
            onChange({
              ...habit,
              measurementType: e.target.value as HabitMeasurementType,
            })
          }
          className="p-2 border rounded"
          disabled={!onRemove}
        >
          <option value="scale">Scale (1-10)</option>
          <option value="hours">Hours</option>
          <option value="times">Times</option>
          <option value="yesno">Yes/No</option>
        </select>

        {/* Frequency */}
        <select
          value={habit.frequency}
          onChange={(e) =>
            onChange({ ...habit, frequency: e.target.value as HabitFrequency })
          }
          className="p-2 border rounded"
          disabled={!onRemove}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Input Based on Measurement Type */}
      <div className="pt-2">
        {habit.measurementType === "scale" && (
          <input
            type="range"
            min="1"
            max="10"
            value={(habit.value as number) || 5}
            onChange={(e) =>
              onChange({ ...habit, value: Number.parseInt(e.target.value) })
            }
            className="w-full"
          />
        )}
        {/* Other input types... */}
      </div>

      {/* Share Toggle */}
      <label className="flex items-center space-x-2">
        <span>Share with professionals:</span>
        <input
          type="checkbox"
          checked={habit.shared}
          onChange={(e) => onChange({ ...habit, shared: e.target.checked })}
          className="h-4 w-4"
        />
      </label>

      {/* Remove Button (only for custom habits) */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-red-500 mt-2"
        >
          Remove this habit
        </button>
      )}
    </div>
  );
}
