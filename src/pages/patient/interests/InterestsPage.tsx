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
    const handleNavigateToCreateInterest = () => {
        navigate('/create-interest');
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4 bg-primary">
            <Header title="Pedido de ajuda" subtitle="barbariza mona" />

            {/* Properly using the TextIconButton with text, icon and onClick handler */}
            <TextIconButton
                text="Personalizar"
                icon="pencil"
                onClick={handleNavigateToCreateInterest}
                className="mb-4"
            />

            {/* InterestsSelector component */}
            <InterestsSelector items={defaultItemsList} />

            <div className="px-4 mt-auto pb-4">
                <Button
                    variant="orange"
                    size="responsive"
                    type="submit"
                >
                    Continuar
                </Button>
            </div>
        </div>
    );
}