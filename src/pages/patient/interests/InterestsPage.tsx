import { useState } from "react";
import { Button } from "@/components/forms/button";
import Header from "@/components/ui/header";
import TextIconButton from "@/components/ui/icon-button";
import InterestsSelector from "@/components/ui/interests-selector";
import { useNavigate } from "react-router-dom";

// Define the default items list
const defaultItemsList = [
    { id: 1, title: 'Comer pouco/mal', icon: 'burger' },
    { id: 2, title: 'Dormir mal', icon: 'sleep' },
    { id: 3, title: 'Autossabotagem', icon: 'mask' },
    { id: 4, title: 'Passar muito tempo no celular', icon: 'mobile' },
    { id: 5, title: 'Procrastinação', icon: 'clock' }
];

export default function InterestPage() {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState<(string | number)[]>([]);

    const handleNavigateToCreateInterest = () => {
        navigate('/create-interest');
    };

    const handleSelectionChange = (selectedItems: (string | number)[]) => {
        setSelectedInterests(selectedItems);
    };

    const handleContinue = () => {
        // Get the selected items details from defaultItemsList
        const selectedItems = defaultItemsList.filter(item => 
            selectedInterests.includes(item.id)
        );

        console.log("Selected items:", selectedItems);
        
        // You can navigate to next page with selected items
        // navigate('/next-page', { state: { selectedItems } });
        
        // Or you can handle the selected items in any way you need
    };

    return (
        <div className="flex flex-col h-screen mx-auto p-4 bg-primary">
            <Header title="Pedido de ajuda" subtitle="barbariza mona" />

            {/* Properly using the TextIconButton with text, icon and onClick handler */}
            <TextIconButton
                text="Personalizar"
                icon="pencil"
                onClick={handleNavigateToCreateInterest}
                className="mb-4"
            />

            {/* InterestsSelector component with selection change handler */}
            <InterestsSelector 
                items={defaultItemsList}
                onSelectionChange={handleSelectionChange}
            />

            <div className="px-4 mt-auto pt-4">
                <Button
                    variant="orange"
                    size="responsive"
                    type="button"
                    onClick={handleContinue}
                    disabled={selectedInterests.length === 0}
                >
                    Continuar ({selectedInterests.length} selecionado{selectedInterests.length !== 1 ? 's' : ''})
                </Button>
            </div>
        </div>
    );
}