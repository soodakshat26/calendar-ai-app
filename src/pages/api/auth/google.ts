import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { setSessionCookie } from "../../../lib/auth/withSession";
import { UserSession } from "../../../lib/types";
// REMOVE references to Web Firestore in "firebase.ts" 
// and "firebase/firestore"
//
// ADD the Admin DB import:
import { adminDb } from "../../../lib/admin";

const redirectURI =
  process.env.NODE_ENV === "production"
    ? "https://calendar-ai-app-lyart.vercel.app/api/auth/google"
    : "http://localhost:3000/api/auth/google";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectURI
);

export default async function googleAuth(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Step 1: Start OAuth flow if we don't have a 'code' param
    const code = req.query.code as string | undefined;
    if (!code) {
      const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/calendar.readonly",
      ];

      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
      });
      return res.redirect(url);
    } else {
      // Step 2: We have a 'code', so exchange it for tokens
      try {
        const { tokens } = await oauth2Client.getToken(code);
        if (!tokens.access_token) {
          return res.status(401).send("No access token returned");
        }

        // Get user info
        oauth2Client.setCredentials({ access_token: tokens.access_token });
        const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
        const userInfo = await oauth2.userinfo.get();
        const { email, picture, id } = userInfo.data;

        if (!email || !id) {
          return res.status(400).send("Could not retrieve user info from Google");
        }

        // Upsert user in Firestore (now using Admin SDK)
        const userRef = adminDb.collection("users").doc(id);
        const existingDoc = await userRef.get();

        if (!existingDoc.exists) {
          // Create new user doc
          await userRef.set({
            email,
            picture,
            createdAt: new Date().toISOString(),
          });
        }

        // Create session
        const sessionData: UserSession = {
          userId: id,
          email,
          accessToken: tokens.access_token,
        };
        setSessionCookie(res, sessionData);

        // Redirect to dashboard
        return res.redirect("/dashboard");
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        return res.status(500).send("OAuth error");
      }
    }
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
