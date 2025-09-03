import cors from "@fastify/cors";
import fastify from "fastify";
import { diContainer, env, handleError, z, allRoutes } from "./plugins";
import swagger from "@fastify/swagger"
import swaggerUI from "@fastify/swagger-ui"
import rateLimit from '@fastify/rate-limit'
import type { FastifyRequest } from 'fastify'

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
// Rate limit: use env RATE_LIMIT_REQUESTS_PER_MINUTE to configure requests per minute
const requestsPerMinute = Number(env.RATE_LIMIT_REQUESTS_PER_MINUTE) || 60;
// @fastify/rate-limit expects points per window; window is 1 minute (60 seconds)
app.register(rateLimit, {
	max: requestsPerMinute,
	timeWindow: '1 minute',
	keyGenerator: (request: FastifyRequest) => request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown',
	errorResponseBuilder: function (req: FastifyRequest, context: any) {
		return {
			statusCode: 429,
			error: 'Too Many Requests',
			message: `You have exceeded the ${context.max} requests in ${context.after} seconds limit!`,
		};
	}
});

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