import { asValue, createContainer } from "awilix";
import prisma from "./prisma";

const container = createContainer();

container.register({
	prisma: asValue(prisma),
});

export default container;
