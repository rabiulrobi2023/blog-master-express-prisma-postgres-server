import { Prisma } from "../../../generated/prisma/client";

const buildSearchCondition = (
  searchTerm: string,
  searchableFields: string[],
) => ({
  OR: searchableFields.map((field) => ({
    [field]: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
  })),
});

export default buildSearchCondition