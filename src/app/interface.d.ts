import { IJwtTokenPayload } from "./interface";

declare global {
  namespace Express {
    interface Request {
      user: IJwtTokenPayload;
    }
  }
}
