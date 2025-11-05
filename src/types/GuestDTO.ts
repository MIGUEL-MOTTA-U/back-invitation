interface CompanionInput {
    name: string;
    confirmed: boolean;
}

interface GuestDTO {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    phoneCountryCode?: string | null;
    message?: string | null;
    confirmed: boolean;
    isCompanion?: boolean;
    guestId?: string | null;
}

interface GuestWithCompanionsDTO {
    name: string;
    email?: string | null;
    phone?: string | null;
    phoneCountryCode?: string | null;
    message?: string | null;
    confirmed: boolean;
    companions?: CompanionInput[];
}

export default GuestDTO;
export type { CompanionInput, GuestWithCompanionsDTO };