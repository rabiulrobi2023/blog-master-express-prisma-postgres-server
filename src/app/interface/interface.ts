import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";

export interface IJwtTokenPayloads extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface IPaginationOptions {
  page: string | number;
  limit: string | number;
  sortBy: string;
  sortOrder: string;
}

export interface IPagination extends IPaginationOptions {
  skip: number;
}
