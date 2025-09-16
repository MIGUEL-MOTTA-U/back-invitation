import { GuestDTO, PreliminaryGuest, ConfirmedGuest, PersonEntry } from "../../types";

interface GuestRepository {
    getGuestById(guestId:string):Promise<GuestDTO | null>;
    getGuests(params: { page?: number, size?: number, name?: string, email?:string }): Promise<GuestDTO[]>;
    getConfirmedGuestsWithCompanions(params?: { page?: number, size?: number }): Promise<{ guests: ConfirmedGuest[], total: number }>;
    getPaginatedPeople(params?: { page?: number, size?: number }): Promise<{ people: PersonEntry[], total: number, totalGuests: number, totalCompanions: number, totalConfirmedGuests: number, totalUnconfirmedGuests: number, totalConfirmedCompanions: number, totalUnconfirmedCompanions: number }>;
    createGuest(guestDTO:GuestDTO):Promise<string>;
    createPreliminaryGuests(guestPreliminaryDTO: PreliminaryGuest):Promise<string>;
    deleteGuest(guestId:string):Promise<void>;
    updateGuest(guestId: string, guestDTO:Partial<GuestDTO>):Promise<void>;
}

export default GuestRepository;