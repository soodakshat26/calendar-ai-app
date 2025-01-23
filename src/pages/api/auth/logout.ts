import { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "../../../lib/auth/withSession";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    clearSessionCookie(res);
    return res.redirect("/");
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
