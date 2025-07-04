import { Prisma } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import ErrorTemplate from '../errors/ErrorTemplate';

export const handleError = (error: unknown, _request: FastifyRequest, response: FastifyReply) => {
  const parsedError = error as Error;
  response.log.warn(`There has been an error ${parsedError.name}`);
  if (error instanceof ZodError) {
    return response.status(400).send({
      statusCode: 400,
      message: 'Bad request',
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError) {
    response.log.error(error.message);
    return response.status(400).send({
      statusCode: 400,
      message: 'Bad Request, Database Error',
    });
  }

  if (error instanceof Prisma.PrismaClientRustPanicError || error instanceof Prisma.PrismaClientUnknownRequestError) {
    response.log.error(error.message);
    return response.status(500).send({
      statusCode: 500,
      message: 'Database Runtime Error',
    });
  }

  if (error instanceof ErrorTemplate) {
    response.log.error(error.details);
    return response.status(error.code).send({
      statusCode: error.code,
      message: error.message,
    });
  }

  return response.status(500).send({
    statusCode: 500,
    message: 'Internal Server Error',
  });
}; 