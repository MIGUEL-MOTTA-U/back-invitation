import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

const UserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
});

export default async function userRoutes(app: FastifyInstance) {
	app.post("/users", async (request, reply) => {
		const result = UserSchema.safeParse(request.body);
		if (!result.success) {
			return reply.status(400).send(result.error);
		}
		const user = await prisma.user.create({ data: result.data });
		return reply.status(201).send(user);
	});
}
