import React, { useState, useEffect } from "react";
import { Checkbox } from "../forms/checkbox";

interface ReminderCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isChecked: boolean;
  onCheckboxChange: (checked: boolean) => void;
  showCheckbox?: boolean;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  subtitle,
  icon,
  isChecked,
  onCheckboxChange,
  showCheckbox = true,
}) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleCheckboxChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onCheckboxChange(newChecked);
  };

  return (
    <div style={styles.container}>
      {/* Icon container */}
      <div style={styles.iconContainer}>{icon}</div>

      {/* Text content */}
      <div style={styles.textContainer}>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>

      {/* Checkbox (conditionally rendered) */}
      {showCheckbox && (
        <Checkbox
          checked={checked}
          onCheckedChange={handleCheckboxChange}
          color="#DDFC8E"
          height="h-7"
          width="w-7"
          radius="rounded-md"
          showChildrenOnSelectOnly={true}
        >
          <span className="mgc_check_line" style={styles.checkIcon} />
        </Checkbox>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9FF",
    borderRadius: "14px",
    padding: "16px",
    width: "100%",
    margin: "8px 0",
    minHeight: "72px",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAE7FF",
    borderRadius: "50%",
    width: "54px",
    height: "54px",
    fontSize: "20px",
    color: "#6A5ACD",
  },
  textContainer: {
    flex: 1,
    marginLeft: "16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: "normal",
    margin: 0,
    color: "#141B36",
    fontFamily: '"Inter", sans-serif',
  },
  subtitle: {
    fontSize: "12px",
    margin: 0,
    color: "#A0A3B1",
    fontFamily: '"Inter", sans-serif',
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "25%",
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  },
  customCheckbox: {
    appearance: "none",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "none",
    backgroundColor: "transparent",
  },
  checkIcon: {
    fontSize: "12px",
    color: "#141B36",
  },
};

export default ReminderCard;
