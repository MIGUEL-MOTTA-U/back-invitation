import prisma from "./prisma";
import { handleError } from "./handlerError";
import env from "./dotenv";
import z from "./zod"
import diContainer from "./diContainer";
import allRoutes from "./routes";


export { env, prisma, z, diContainer, handleError, allRoutes };
