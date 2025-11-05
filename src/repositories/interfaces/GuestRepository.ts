import { GuestDTO, GuestWithCompanionsDTO, PreliminaryGuest, ConfirmedGuest, PersonEntry } from "../../types";

interface GuestWithCompanionsResponse {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    phoneCountryCode: string | null;
    message: string | null;
    confirmed: boolean;
    companions: {
        id: string;
        name: string;
        confirmed: boolean;
    }[];
}

interface GuestRepository {
    getGuestById(guestId:string):Promise<GuestDTO | null>;
    getGuests(params: { page?: number, size?: number, name?: string, email?:string }): Promise<GuestDTO[]>;
    getAllGuestsWithCompanions(): Promise<GuestWithCompanionsResponse[]>;
    getConfirmedGuestsWithCompanions(params?: { page?: number, size?: number }): Promise<{ guests: ConfirmedGuest[], total: number }>;
    getPaginatedPeople(params?: { page?: number, size?: number }): Promise<{ people: PersonEntry[], total: number, totalGuests: number, totalCompanions: number, totalConfirmedGuests: number, totalUnconfirmedGuests: number, totalConfirmedCompanions: number, totalUnconfirmedCompanions: number }>;
    getPaginatedGuestGroups(params?: { page?: number, size?: number }): Promise<{ people: PersonEntry[], total: number, totalGuests: number, totalCompanions: number, totalConfirmedGuests: number, totalUnconfirmedGuests: number, totalConfirmedCompanions: number, totalUnconfirmedCompanions: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean }>;
    createGuest(guestDTO:GuestDTO):Promise<string>;
    createGuestWithCompanions(guestDTO: GuestWithCompanionsDTO):Promise<string>;
    createPreliminaryGuests(guestPreliminaryDTO: PreliminaryGuest):Promise<string>;
    deleteGuest(guestId:string):Promise<void>;
    updateGuest(guestId: string, guestDTO:Partial<GuestDTO>):Promise<void>;
}

export default GuestRepository;