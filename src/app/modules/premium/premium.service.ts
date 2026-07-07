import { PostWhereInput } from "../../../../generated/prisma/models";
import { IPaginationOptions } from "../../interface/interface";
import { prisma } from "../../lib/prisma";
import buildFilterCondition from "../../utils/buildFilterCondition";
import buildSearchCondition from "../../utils/buildSearchCondition";
import calculatePagination from "../../utils/calculatePagination";
import {
  postFilterableFields,
  postSerachableFields,
} from "../post/post.constant";
import { IPostQuery } from "../post/post.interface";

const getPremiumContentFromDB = async (query: IPostQuery) => {
  const { searchTerm, limit, page, sortBy, sortOrder, ...queryFilter } = query;
  const pagination = calculatePagination({
    page,
    limit,
    sortBy,
    sortOrder,
  } as IPaginationOptions);

  const andConditions: PostWhereInput[] = [];

  if (searchTerm?.trim()) {
    const searchCondition = buildSearchCondition(
      searchTerm?.trim() as string,
      postSerachableFields,
    );
    andConditions.push(searchCondition);
  }

  if (queryFilter) {
    const filterCondition = buildFilterCondition(
      queryFilter,
      postFilterableFields,
    );

    andConditions.push(filterCondition);
  }

  andConditions.push({ isPremium: true });
  const result = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },

    skip: pagination.skip,
    take: pagination.limit as number,
    orderBy: { [pagination.sortBy]: pagination.sortOrder },

    // include: {
    //   author: {
    //     omit: {
    //       password: true,
    //       email: true,
    //       activeStatus: true,
    //     },
    //   },
    //   comments: true,
    // },
  });

  const totalPostCount = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: result,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: totalPostCount,
      totalPage: Math.ceil(totalPostCount / pagination.limit),
    },
  };
};

export const PremiumContentService = {
  getPremiumContentFromDB,
};
