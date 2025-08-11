import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * Handles common Prisma errors and throws appropriate NestJS exceptions.
 *
 * @param error - The caught Prisma error
 * @param entity - The entity name, e.g. 'User', used in error messages
 * @param idOrValue - The id or conflicting value to include in error messages
 * @throws NestJS HttpException matching Prisma error code or rethrows unknown errors
 */
export function handlePrismaError(
  error: unknown,
  entity: string,
  idOrValue?: string | number
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000': // String or JSON value is too long for the column
        throw new BadRequestException(`${entity}: value too long for a field`);

      case 'P2001': // Record not found for a required relation
        throw new NotFoundException(`${entity} related record not found`);

      case 'P2002': {
        // Unique constraint failed
        const metaTarget =
          (error.meta?.['target'] as string[])?.join(', ') ||
          'unique constraint';
        throw new ConflictException(
          `${entity} with the same ${metaTarget} already exists`
        );
      }

      case 'P2003': // Foreign key constraint failed
        throw new BadRequestException(
          `Cannot modify ${entity} due to related records`
        );

      case 'P2004': // A constraint failed
        throw new BadRequestException(`Constraint failed on ${entity}`);

      case 'P2005': // Invalid value for field
        throw new BadRequestException(`Invalid value provided for ${entity}`);

      case 'P2006': // Field value too long
        throw new BadRequestException(`Field value too long in ${entity}`);

      case 'P2007': // Data validation error
        throw new BadRequestException(`Data validation error on ${entity}`);

      case 'P2025': // Record to update/delete not found
        throw new NotFoundException(`${entity} with ID ${idOrValue} not found`);

      case 'P2030': // Transaction API error
        throw new BadRequestException(
          `Transaction error occurred on ${entity}`
        );

      // Other Prisma error codes as needed
    }
  }

  throw error;
}
