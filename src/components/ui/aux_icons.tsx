import type React from "react";

interface Icon {
  label: string;
  icon: React.ReactNode;
  shouldFlip?: boolean;
}

const icon: Icon[] = [
  {
    label: "Remedio",
    icon: <span role="img" aria-label="capsule" className="mgc_capsule_line" />,
    shouldFlip: true,
  },
  {
    label: "Lapis",
    icon: <span role="img" aria-label="pencil" className="mgc_pencil_line" />,
    shouldFlip: false,
  },
];

const AuxIcons: React.FC = () => {
  return (
    <div className="flex justify-around items-center bg-background py-2 shadow-sm">
      {icon.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center text-gray2 font-medium text-xs font-inter cursor-pointer"
        >
          <div
            className={`text-2xl mb-0.5 p-0.5 bg-transparent rounded-lg ${
              item.shouldFlip ? "scale-x-[-1]" : ""
            }`}
          >
            {item.icon}
          </div>
          <div className="text-[10px]">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default AuxIcons;
