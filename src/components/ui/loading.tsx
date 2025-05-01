import React from "react";

const LoadingOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #FA6E5A",
              borderRadius: "50%",
              borderTop: "5px solid transparent",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
        <p
          style={{
            marginTop: "1rem",
            fontWeight: "bold",
            color: "#FA6E5A",
          }}
        >
          Saving reminder...
        </p>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingOverlay;