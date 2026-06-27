import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";

export interface IJwtTokenPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}