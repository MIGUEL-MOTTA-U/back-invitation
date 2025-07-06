interface GuestDTO {
    id?: string;
    name: string;
    email: string;
    phone: string;
    phoneCountryCode: string;
    message?: string | null;
    confirmed: boolean;
}

export default GuestDTO;