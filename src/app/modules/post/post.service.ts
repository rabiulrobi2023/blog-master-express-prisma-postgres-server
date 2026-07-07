import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreatePostPayload, IPostQuery, IUpdatePost } from "./post.interface";
import { PostWhereInput } from "../../../../generated/prisma/models";
import { Prisma } from "../../../../generated/prisma/client";
import { postFilterableFields, postSerachableFields } from "./post.constant";
import { IPaginationOptions } from "../../interface/interface";
import buildSearchCondition from "../../utils/buildSearchCondition";
import buildFilterCondition from "../../utils/buildFilterCondition";
import calculatePagination from "../../utils/calculatePagination";

const createPostIntoDB = async (
  authorId: string,
  payload: ICreatePostPayload,
) => {
  const user = await prisma.user.findUnique({
    where: { id: authorId },
    include: { subscription: true },
  });

  if (payload.isPremium && user?.subscription?.status !== "ACTIVE") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You are not a premium user. So you can not create premium content",
    );
  }
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId,
      tags: payload.tags ?? [],
    },
  });
  return result;
};

const getAllPostsFromDB = async (query: IPostQuery) => {
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

  andConditions.push({ isPremium: false });
  const result = await prisma.post.findMany({
    where: {
      //Filtering in single field
      // status:"DRAFT"
      //
      //
      //Filtering in multiple field
      // AND:[
      //   {
      //     status: "PUBLISHED"
      //   },
      //   {
      //     title: "Learning Express"
      //   }
      // ]
      //
      //
      //Filtering in array type field
      // AND: [
      //   {
      //     tags: {
      //       has: "database",
      //     },
      //   },
      // ],
      //
      //
      //Searching in single field and case sensetive
      // title: {contains:"Backend"}
      //
      //
      //Searching in single field and case insensetive
      // title: {contains:"backend", mode:"insensitive"}
      //
      //
      // Searching in multiple field
      // OR: [
      //   {
      //     title: { contains: "backend", mode: "insensitive" },
      //   },
      //   { content: { contains: "database", mode: "insensitive" } },
      // ],
      //
      //
      //Combination of filtering and searching
      // AND: [
      //   { status: "PUBLISHED" },
      //   {
      //     OR: [
      //       { title: { contains: "express", mode: "insensitive" } },
      //       { content: { contains: "database", mode: "insensitive" } },
      //     ],
      //   },
      // ],
      //
      //
      //
      //Dynamic filtering and searching
      // AND: [
      //   query.title ? { title: query.title } : {},
      //   query.status ? { status: query.status } : {},
      //   query.searchTerm
      //     ? {
      //         OR: [
      //           {
      //             content: { contains: query.searchTerm, mode: "insensitive" },
      //           },
      //           { title: { contains: query.searchTerm, mode: "insensitive" } },
      //         ],
      //       }
      //     : {},
      // ],

      AND: andConditions,
    },
    // Dynamic pagination and sorting
    // take: limit,
    // skip: skip,
    // orderBy: { [sortBy]: sortOrder },
    //
    //
    //Dynamic and optimized pagination
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
const getSinglePostFromDB = async (postId: string) => {
  return await prisma.post.update({
    where: { id: postId, isPremium: false },
    data: {
      views: { increment: 1 },
    },
    include: {
      author: {
        omit: {
          password: true,
          id: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  //Alternative

  // return prisma.$transaction(async (tnx) => {
  //   await tnx.post.update({
  //     where: {
  //       id: postId,
  //     },
  //     data: {
  //       views: {
  //         increment: 1,
  //       },
  //     },
  //   });

  //   return await tnx.post.findUnique({
  //     where: { id: postId },
  //     include: {
  //       author: {
  //         omit: {
  //           password: true,
  //           id: true,
  //         },
  //       },
  //       _count: {
  //         select: { comments: true },
  //       },
  //     },
  //   });
  // });
};

const getMyPostsFromDB = async (authorId: string) => {
  console.log(authorId);
  const result = await prisma.post.findMany({
    where: { authorId },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const updatePostIntoDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
  payload: IUpdatePost,
) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, "Post not found");
  }

  if (!isAdmin && post.authorId != authorId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not the author of this post",
    );
  }

  const result = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return result;
};
const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId != authorId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not the author of this post",
    );
  }
  await prisma.post.delete({ where: { id: postId } });
  return null;
};

const getPostStatsFromDB = async () => {
  return await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();
    // const totalApprovedPosts = await tx.post.count({
    //   where: {
    //     status: "PUBLISHED",
    //   },
    // });
    // const totalArchivedPosts = await tx.post.count({
    //   where: { status: "ARCHIVED" },
    // });

    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: "DRAFT",
    //   },
    // });

    // const totalComments = await tx.comment.count();

    // const totalApprovedComments = await tx.comment.count({
    //   where: { status: "APPROVED" },
    // });

    // const totalRejectedComments = await tx.comment.count({
    //   where: { status: "REJECTED" },
    // });

    // const totalViewsAggregrate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    // const totalViews = totalViewsAggregrate._sum.views;

    // return {
    //   totalPosts,
    //   totalApprovedPosts,
    //   totalArchivedPosts,
    //   totalDraftPosts,
    //   totalComments,
    //   totalApprovedComments,
    //   totalRejectedComments,
    //   totalViews,
    // };

    //Alternative [The avove method is series sequencial that takes long time. The bellow method is parallel async operation so it take less time]

    const [
      totalPosts,
      totalApprovedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViewsAggregrate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      await tx.post.count({
        where: { status: "ARCHIVED" },
      }),
      await tx.post.count({
        where: {
          status: "DRAFT",
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: { status: "APPROVED" },
      }),
      await tx.comment.count({
        where: { status: "REJECTED" },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalApprovedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViewsAggregrate: totalViewsAggregrate._sum.views,
    };
  });
};

export const PostService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getSinglePostFromDB,
  getMyPostsFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  getPostStatsFromDB,
};
