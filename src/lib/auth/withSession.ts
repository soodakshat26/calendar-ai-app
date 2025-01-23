// src/lib/auth/withSession.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize, parse } from "cookie";
import jwt from "jsonwebtoken";
import { UserSession } from "../types"; // <-- Import your custom interface

const COOKIE_NAME = "session_token";
const SECRET = process.env.SESSION_SECRET || "dev_secret";

export function setSessionCookie(res: NextApiResponse, sessionData: object) {
  const token = jwt.sign(sessionData, SECRET, { expiresIn: "2h" });
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7200, // 2 hours
    sameSite: "lax",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function getSessionCookie(req: NextApiRequest): UserSession | null {
  const { cookie } = req.headers;
  if (!cookie) return null;

  const cookies = parse(cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    // Cast the verified token to your UserSession interface
    const data = jwt.verify(token, SECRET) as UserSession;
    return data;
  } catch (error) {
    return null;
  }
}

export function clearSessionCookie(res: NextApiResponse) {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  res.setHeader("Set-Cookie", cookie);
}
