import PreliminaryAssistant from "./PreliminaryAssistant";

interface PreliminaryGuest extends PreliminaryAssistant {
    companions: PreliminaryAssistant[];
}

export default PreliminaryGuest;