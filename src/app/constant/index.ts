import { IPagination } from "../interface/interface";

type TPaginationKeys = keyof IPagination;

export const paginationFields: TPaginationKeys[] = [
  "page",
  "limit",
  "skip",
  "sortBy",
  "sortOrder",
] as const;
