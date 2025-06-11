import { useState } from "react";
import { Button } from "@/components/forms/button";
import Header from "@/components/ui/header";
import TextIconButton from "@/components/ui/icon-button";
import InterestsSelector from "@/components/ui/interests-selector";
import BottomSheet from "@/components/ui/bottom-sheet";
import CustomInterestPage from "./CustomInterestPage";
import { useNavigate } from "react-router-dom";
import BottomNavigationBar from "@/components/ui/navigator-bar";

// Define the default items list -- testing only
const defaultItemsList = [
  { id: 1, title: "Comer pouco/mal", icon: "burger" },
  { id: 2, title: "Dormir mal", icon: "sleep" },
  { id: 3, title: "Autossabotagem", icon: "mask" },
  { id: 4, title: "Passar muito tempo no celular", icon: "mobile" },
  { id: 5, title: "Procrastinação", icon: "clock" },
];

export default function InterestPage() {
    const navigate = useNavigate();

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        navigate("/profile");
        break;
    }
  };
  const [selectedInterests, setSelectedInterests] = useState<
    (string | number)[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsList, setItemsList] = useState(defaultItemsList);

  const handleOpenCustomModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectionChange = (selectedItems: (string | number)[]) => {
    setSelectedInterests(selectedItems);
  };

  const handleAddCustomInterest = (interest: {
    title: string;
    category: string;
    impact: string;
  }) => {
    // Generate an icon based on category
    let icon = "custom";
    if (interest.category === "health") icon = "health";
    if (interest.category === "mental") icon = "brain";
    if (interest.category === "productivity") icon = "clock";

    // Create a new item with a numeric ID
    const newItem = {
      id: Date.now(),
      title: interest.title,
      icon: icon,
    };

    // Add the new item to the list
    setItemsList((prevItems) => [...prevItems, newItem]);

    // Close the modal
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    const selectedItems = itemsList.filter((item) =>
      selectedInterests.includes(item.id),
    );

    console.log("Selected items:", selectedItems);
    // You can navigate to the next page or handle the selected items here
  };

  return (
    <div className="flex flex-col h-screen mx-auto p-4 bg-primary">
      <Header
        title="O que te faz mal?"
        subtitle="Escreva ou escolha hábitos que pioram seu dia:"
      />

      <div className="pt-4">
        <TextIconButton
          text="Personalizar"
          icon="pencil"
          onClick={handleOpenCustomModal}
          className="mb-4"
        />
      </div>

      <InterestsSelector
        items={itemsList}
        onSelectionChange={handleSelectionChange}
      />

      <div className="px-4 mt-auto pt-4 flex content-center">
        <Button
          variant="orange"
          size="responsive"
          type="button"
          onClick={handleContinue}
          disabled={selectedInterests.length === 0}
        >
          Continuar ({selectedInterests.length} selecionado
          {selectedInterests.length !== 1 ? "s" : ""})
        </Button>
      </div>

      {/* Bottom Sheet Modal */}
      <BottomSheet isOpen={isModalOpen} onClose={handleCloseModal}>
        <CustomInterestPage
          onSubmit={handleAddCustomInterest}
          onCancel={handleCloseModal}
        />
      </BottomSheet>
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}
