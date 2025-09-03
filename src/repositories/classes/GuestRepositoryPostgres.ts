import { Prisma, PrismaClient } from "@prisma/client";
import { ErrorRepository } from "../../errors";
import { GuestRepository } from "../";
import { GuestDTO, PreliminaryGuest } from "../../types";
class GuestRepositoryPostgres implements GuestRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getGuestById(guestId: string): Promise<GuestDTO | null> {
        const result = await this.prisma.$transaction([
            this.prisma.guest.findFirst({
                where: { id: guestId }
            })
        ])
        const guest = result[0]
        if (!guest) {
            return null;
        }
        

        // TODO Parse with zod
        const guestDTO: GuestDTO = {
            id: guest.id,
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            phoneCountryCode: guest.phoneCountryCode,
            message: guest.message,
            confirmed: guest.confirmed,
        };
        
        return guestDTO;
    }

    public async getGuests(params: { page?: number, size?: number, name?: string, email?: string }): Promise<GuestDTO[]> {
        const { page = 1, size = 10, name, email } = params;
        const skip = (page - 1) * size;
        const where: Prisma.GuestWhereInput = {}
        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }
        if (email) {
            where.email = { contains: email, mode: 'insensitive' }
        }
        const guests = await this.prisma.$transaction([
            this.prisma.guest.findMany({
                where,
                skip,
                take: size
            })
        ]);
        return guests[0].map(guest => ({
            id: guest.id,
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            phoneCountryCode: guest.phoneCountryCode,
            message: guest.message,
            confirmed: guest.confirmed,
        }));
    }

    public async createPreliminaryGuests(guestPreliminaryDTO: PreliminaryGuest): Promise<string> {
        try {
            // create preliminary guest and its companions in a transaction
            const created = await this.prisma.$transaction([
                this.prisma.preliminaryGuest.create({
                    data: {
                        name: guestPreliminaryDTO.name,
                        confirmed: guestPreliminaryDTO.confirmed,
                        nCompanions: guestPreliminaryDTO.companions.length,
                        companions: {
                            create: (guestPreliminaryDTO.companions || []).map(c => ({
                                name: c.name,
                                confirmed: c.confirmed,
                                preliminaryGuestName: guestPreliminaryDTO.name
                            }))
                        }
                    },
                    include: { companions: true }
                })
            ]);

            return created[0].id;
        } catch (error) {
            const message = (error as Error).message;
            throw new ErrorRepository(ErrorRepository.SERVER_ERROR, message);
        }
    }

    public async createGuest(guestDTO: GuestDTO): Promise<string> {
        const guestExists = await this.guestExistsByEmail(guestDTO.email);
        if (guestExists) throw new ErrorRepository(ErrorRepository.CONFLICT_REPEATED_DATA, "Tried to create a guest but it already exists.");
        const guestCreated = await this.prisma.guest.create({
            data: guestDTO
        });
        return guestCreated.id;
    }

    public async deleteGuest(guestId: string): Promise<void> {
        const guestExists = await this.guestExists(guestId);
        if (!guestExists) throw new ErrorRepository(ErrorRepository.NOT_FOUND, "Tried to delete an nonexistent guest.");
        await this.prisma.$transaction([
            this.prisma.guest.delete({
                where: { id: guestId }
            })
        ]);
    }

    public async updateGuest(guestId: string, guestDTO: Partial<GuestDTO>): Promise<void> {
        const guest = await this.guestExists(guestId);
        if (!guest) throw new ErrorRepository(ErrorRepository.NOT_FOUND, "Tried to update a guest but it didn't exist");
        await this.prisma.$transaction([
            this.prisma.guest.update({
                where: { id: guestId },
                data: guestDTO
            })
        ])
    }

    private async guestExists(guestId: string):Promise<boolean> {
        try{
            const guest = await this.prisma.$transaction([
                this.prisma.guest.findUnique({
                    where: { id: guestId }
                })
            ])
            return guest[0] !== null;
        } catch (error) {
            const message = (error as Error).message
            throw new ErrorRepository(ErrorRepository.SERVER_ERROR, message);
        }
    }

    private async guestExistsByEmail(guestEmail: string): Promise<boolean> {
        try {
            const guest = await this.prisma.$transaction([
                this.prisma.guest.findFirst({
                    where: { email: guestEmail }
                })
            ])
            return guest[0] !== null;
        } catch (error) {
            const message = (error as Error).message
            throw new ErrorRepository(ErrorRepository.SERVER_ERROR, message);
        }
    }
}

export default GuestRepositoryPostgres;