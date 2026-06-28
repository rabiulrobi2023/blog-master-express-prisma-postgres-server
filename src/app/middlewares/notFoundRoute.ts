import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundRoute: RequestHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Api not found",
  });
};

export default notFoundRoute
