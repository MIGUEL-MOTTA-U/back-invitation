import { GuestDTO, PreliminaryGuest } from "../../types";

interface GuestRepository {
    getGuestById(guestId:string):Promise<GuestDTO | null>;
    getGuests(params: { page?: number, size?: number, name?: string, email?:string }): Promise<GuestDTO[]>;
    createGuest(guestDTO:GuestDTO):Promise<string>;
    createPreliminaryGuests(guestPreliminaryDTO: PreliminaryGuest):Promise<string>;
    deleteGuest(guestId:string):Promise<void>;
    updateGuest(guestId: string, guestDTO:Partial<GuestDTO>):Promise<void>;
}

export default GuestRepository;