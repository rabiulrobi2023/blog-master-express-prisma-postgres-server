import { IPagination, IPaginationOptions } from "../interface/interface";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc";

const calculatePagination = ({
  page,
  limit,
  sortBy,
  sortOrder,
}: IPaginationOptions): IPagination => {
  const currentPage = Math.max(Number(page) || DEFAULT_PAGE, 1);
  const currentLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const skip = (currentPage - 1) * currentLimit;

  return {
    skip,
    page: currentPage,
    limit: currentLimit,
    sortBy: sortBy ?? DEFAULT_SORT_BY,
    sortOrder: sortOrder ?? DEFAULT_SORT_ORDER,
  };
};

export default calculatePagination;
