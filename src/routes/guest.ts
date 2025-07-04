import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { diContainer } from "../plugins";
import { GuestRepository } from "../repositories";
import { OutputMessage } from "../types";

const guestRepository = diContainer.resolve<GuestRepository>('guestRepository');
const typeApi = "api-guest"

const sendResponse = async (outputMessage:OutputMessage, response: FastifyReply):Promise<void> => {
	return response.status(outputMessage.status).send(outputMessage);
}

const UserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().min(10),
	message: z.string().optional().nullable(),
	confirmed: z.boolean().default(false)
});

const GuestPartialSchema = z.object({
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().min(10).optional(),
	message: z.string().optional(),
	confirmed: z.boolean().optional()
});

export default async function userRoutes(app: FastifyInstance) {
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

}
