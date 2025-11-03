interface GuestDTO {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    phoneCountryCode?: string | null;
    message?: string | null;
    confirmed: boolean;
}

export default GuestDTO;