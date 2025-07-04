import cors from "@fastify/cors";
import fastify from "fastify";
import { diContainer, env, handleError, z, allRoutes } from "./plugins";
import swagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"

const logLevel = env.LOG_LEVEL;

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
	origin: env.CORS_ORIGIN,
});

app.decorate("container", diContainer);

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

app.register(swagger, {
		swagger: {
			info: { title: "API", version: '1.0.0'}
		}
	}
)
app.register(swaggerUI, {
	routePrefix: "/documentation",
	uiConfig: { docExpansion: "full" }
})

app.register(allRoutes);
app.setErrorHandler(handleError);

const start = async () => {
	try {
		await app.listen({
			port: Number(env.PORT) || 3000,
			host: env.HOST,
		});
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();