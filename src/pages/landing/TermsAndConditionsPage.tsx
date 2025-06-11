import Header from "@/components/ui/header";
import TermsText from "./TermsText";

const TermsAndConditionsPage = () => {
    return (
        <div className="h-screen px-4 py-6">
            <Header title="Termos e condições" />
            <div className="h-[calc(100vh-86px-3rem)] flex justify-center items-center">
                <div className="text-typography py-4 px-6 h-full min-h-[200px] max-w-[1000px] overflow-y-auto bg-offwhite-foreground rounded">
                    <TermsText></TermsText>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
