import type { JwtPayload } from "jsonwebtoken";

export interface UserSession extends JwtPayload {
  userId: string;       // or optional
  email: string;        // or optional
  accessToken: string;  // e.g. from OAuth
}
