import { asClass, asValue, createContainer, Lifetime, InjectionMode } from "awilix";
import prisma from "./prisma";
import { GuestRepositoryPostgres } from "../repositories";

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

container.register({
	prisma: asValue(prisma),
	guestRepository: asClass(GuestRepositoryPostgres, {
		lifetime: Lifetime.SINGLETON
	})
});

export default container;
