import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { diContainer } from "../plugins";
import { GuestRepository } from "../repositories";
import { OutputMessage, PersonEntry } from "../types";

const guestRepository = diContainer.resolve<GuestRepository>('guestRepository');
const typeApi = "api-guest"

const sendResponse = async (outputMessage:OutputMessage, response: FastifyReply):Promise<void> => {
	return response.status(outputMessage.status).send(outputMessage);
}

const UserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().min(10),
	phoneCountryCode: z.string().min(1),
	message: z.string().optional().nullable(),
	confirmed: z.boolean().default(false)
});

const PreliminaryAssistant = z.object({
	name: z.string().min(1),
	confirmed: z.boolean().default(false)
})

const PreliminaryGuest = PreliminaryAssistant.extend({
	companions: z.array(PreliminaryAssistant)
});

const GuestPartialSchema = z.object({
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().min(10).optional(),
	phoneCountryCode: z.string().min(1).optional(),
	message: z.string().optional(),
	confirmed: z.boolean().optional()
});

const PaginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	size: z.coerce.number().int().min(1).max(300).default(10)
});

export default async function userRoutes(app: FastifyInstance) {
	app.get("/guests/bulk", async (request, reply) => {
		try {
			// Validate pagination parameters
			const paginationResult = PaginationSchema.safeParse(request.query);
			if (!paginationResult.success) {
				return reply.status(400).send({ 
					message: "Invalid pagination parameters", 
					errors: paginationResult.error.errors 
				});
			}

			const { page, size } = paginationResult.data;
			const result = await guestRepository.getPaginatedPeople({ page, size });
			const { people, total, totalGuests, totalCompanions, totalConfirmedGuests, totalUnconfirmedGuests, totalConfirmedCompanions, totalUnconfirmedCompanions } = result;
			
			// Separate people by type and confirmation status
			const guests = people.filter(person => person.type === 'guest');
			const companions = people.filter(person => person.type === 'companion');
			const confirmedPeople = people.filter(person => person.confirmed);
			const unconfirmedPeople = people.filter(person => !person.confirmed);
			const confirmedGuests = guests.filter(guest => guest.confirmed);
			const unconfirmedGuests = guests.filter(guest => !guest.confirmed);
			const confirmedCompanions = companions.filter(companion => companion.confirmed);
			const unconfirmedCompanions = companions.filter(companion => !companion.confirmed);
			
			// Calculate pagination metadata
			const totalPages = Math.ceil(total / size);
			const hasNextPage = page < totalPages;
			const hasPreviousPage = page > 1;
			
			return sendResponse({ 
				message: "All people retrieved successfully with pagination", 
				status: 200, 
				type: typeApi, 
				payload: { 
					people,
					guests,
					companions,
					confirmedPeople,
					unconfirmedPeople,
					pagination: {
						currentPage: page,
						pageSize: size,
						totalItems: total,
						totalPages,
						hasNextPage,
						hasPreviousPage
					},
					statistics: {
						// Page-level statistics
						pageGuests: guests.length,
						pageCompanions: companions.length,
						pageConfirmedGuests: confirmedGuests.length,
						pageUnconfirmedGuests: unconfirmedGuests.length,
						pageConfirmedCompanions: confirmedCompanions.length,
						pageUnconfirmedCompanions: unconfirmedCompanions.length,
						pageConfirmedPeople: confirmedPeople.length,
						pageUnconfirmedPeople: unconfirmedPeople.length,
						
						// Global statistics
						totalPeople: total,
						totalGuests,
						totalCompanions,
						totalConfirmedGuests,
						totalUnconfirmedGuests,
						totalConfirmedCompanions,
						totalUnconfirmedCompanions,
						totalConfirmedPeople: totalConfirmedGuests + totalConfirmedCompanions,
						totalUnconfirmedPeople: totalUnconfirmedGuests + totalUnconfirmedCompanions
					}
				}
			}, reply);
		} catch (error) {
			console.error("Error fetching paginated people:", error);
			return reply.status(500).send({ message: "Internal server error", error: (error as Error).message });
		}
	});

	app.post("/guests/bulk", async (request, reply) => {
		const result = PreliminaryGuest.safeParse(request.body);
		if (!result.success) {
			return reply.status(400).send(result.error);
		}
		const data = result.data;
		const user = await guestRepository.createPreliminaryGuests(result.data);
		return sendResponse({ message: `The user was succesfuly created with id ${user}`, status: 201, type: typeApi, payload: { userId: user}}, reply);
	});

	/*
	app.post("/guests", async (request, reply) => {
		const result = UserSchema.safeParse(request.body);
		if (!result.success) {
			return reply.status(400).send(result.error);
		}
		const user = await guestRepository.createGuest(result.data);
		return sendResponse({ message: `The user was succesfuly created with id ${user}`, status: 201, type: typeApi, payload: { userId: user}}, reply);
	});

	app.get("/guests", async (req, res) => {
		const { page, size, name, email } = req.query as { page?: number, size?: number, name?: string, email?:string };
		const result = await guestRepository.getGuests({ page: (page && Number(page) > 0) ? Number(page) : 1, size: size ? Number(size) : 10, name, email });
		return sendResponse({ message: "Query completed! Added to the payload field.", status: 200, type: typeApi, payload: result}, res);
	});

	app.put("/guests/:id", async (req, res) => {
		const {id} = req.params as { id: string }
		const result = GuestPartialSchema.safeParse(req.body);
		if (!result.success) return res.status(404).send('Bad Request');
		await guestRepository.updateGuest(id, result.data);
		return sendResponse({ message: "The user was succesfuly updated!", status: 204, type: typeApi }, res);

	});

	app.get("/guests/:id", async (req, res) => {
		const {id} = req.params as { id: string }
		const result = await guestRepository.getGuestById(id);
		if (!result) return res.status(404).send({message: "Guest doesn't exist"});
		return sendResponse({ message: `Guest found ${id}`, status: 200, type: typeApi, payload: result}, res);
	});

	app.delete("/guests/:id", async (req, res) => {
		const { id} = req.params as { id: string };
		await guestRepository.deleteGuest(id);
		return sendResponse({ message: `The user with Id ${id} was deleted.`, status: 200, type: typeApi}, res);
	})
	*/
}
