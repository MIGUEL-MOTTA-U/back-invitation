import cors from "@fastify/cors";
import fastify from "fastify";
import { container, env } from "./plugins";
import { z } from "./plugins/zod";
import { userRoutes } from "./routes";
const logLevel = env.LOG_LEVEL || "info";

const app = fastify({
	logger: {
		level: logLevel,
		transport: true // is pretty
			? {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:standard",
					},
				}
			: undefined,
	},
});

app.register(cors, {
	origin: "*", // Cambia esto en producción
});

app.decorate("container", container);

const HelloSchema = z.object({
	name: z.string().min(1),
});

app.get("/hello", async (request, reply) => {
	const result = HelloSchema.safeParse(request.query);
	if (!result.success) {
		return reply.status(400).send(result.error);
	}
	return { message: `Hola, ${result.data.name}!` };
});

app.register(userRoutes);

const start = async () => {
	try {
		await app.listen({
			port: Number(env.PORT) || 3000,
			host: "0.0.0.0",
		});
		console.log("Servidor escuchando en el puerto", env.PORT);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
