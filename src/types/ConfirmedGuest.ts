import PreliminaryAssistant from "./PreliminaryAssistant";

interface ConfirmedGuest {
    id: string;
    name: string;
    confirmed: boolean;
    nCompanions: number;
    companions: PreliminaryAssistant[];
}

export default ConfirmedGuest;