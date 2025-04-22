import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  rightIcon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackClick,
  rightIcon,
}) => {
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div>
      {/* Back Button */}
      <button style={styles.backButton} onClick={handleBackClick}>
        <span style={styles.backIcon}>&larr;</span>
      </button>
      <div style={styles.iconTextContainer}>
        <div style={styles.textContainer}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Optional Icon */}
        {rightIcon && <div style={styles.rightIconContainer}>{rightIcon}</div>}
      </div>
      {/* Title and Subtitle */}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  iconTextContainer: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "space-between",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
  },
  backIcon: {
    fontSize: "18px",
    color: "#333",
  },
  textContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0,
    fontFamily: '"Work Sans", sans-serif',
    color: "#141B36",
  },
  subtitle: {
    fontSize: "14px",
    margin: 0,
    fontFamily: '"Inter", sans-serif',
    color: "#666",
  },
  rightIconContainer: {
    marginLeft: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "#6A5ACD",
  },
};

export default Header;
