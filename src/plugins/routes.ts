import { FastifyInstance } from "fastify"
import { routes } from "../routes"

const allRoutes = async (app: FastifyInstance) => {
    routes.forEach(route => {
        app.register(route, { prefix: "/api/v1"});
    });
};

export default allRoutes;