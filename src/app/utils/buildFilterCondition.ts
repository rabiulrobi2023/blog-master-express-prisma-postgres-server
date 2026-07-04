import { IPostQuery } from "../modules/post/post.interface";

  const buildFilterCondition = (
    queryFilter: IPostQuery,
    filterableFiels: string[],
  ) => {
    return {
      AND: Object.entries(queryFilter)
        .filter(
          ([key, value]) =>
            filterableFiels.includes(key) &&
            value !== undefined &&
            value !== null &&
            value != "",
        )
        .map(([key, value]) => ({ [key]: value })),
    };
  };

  export default buildFilterCondition